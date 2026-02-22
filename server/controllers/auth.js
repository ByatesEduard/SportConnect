import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validationEmail } from '../validation/auth.js'

// Register user (username, email, password only; no telephone)
export const register = async (req, res) => {
  try {
    let { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.json({ message: 'Заповніть усі поля' })
    }

    email = email.trim().toLowerCase()
    username = username.trim()

    // Username: only Latin letters and numbers
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.json({
        message: 'Username тільки латиницею (літери, цифри, _)',
      })
    }

    if (!validationEmail(email)) {
      return res.json({
        message: 'Невірний формат email',
      })
    }

    const isUsernameUsed = await User.findOne({ username })
    if (isUsernameUsed) {
      return res.json({
        message: 'Цей username вже зайнятий.',
      })
    }

    const isEmailUsed = await User.findOne({ email })
    if (isEmailUsed) {
      return res.json({
        message: 'Цей email вже зайнятий.',
      })
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    const newUser = new User({
      username,
      email,
      password: hash,
    })

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )
    await newUser.save()

    return res.json({
      newUser,
      user: newUser,
      token,
      message: 'Реєстрація успішна.',
    })
  } catch (error) {
    console.log(error)
    res.json({ message: 'Помилка при створенні користувача.' })
  }
}

// Login user (username + password)
export const login = async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.json({ message: 'Введіть username та пароль.' })
    }
    const user = await User.findOne({ username: username.trim() })

    if (!user) {
      return res.json({
        message: 'Користувача з таким username не знайдено.',
      })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.json({
        message: 'Невірний пароль.',
      })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )

    res.json({
      token,
      user,
      message: 'Ви увійшли в систему.',
    })
  } catch (error) {
    res.json({ message: 'Помилка при авторизації.' })
  }
}

// Get Me (returns user, token, role, personalInfo)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.json({ message: 'Користувача не знайдено.' })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )

    const personalInfo = {
      fullName: user.fullName || user.username,
      email: user.email,
      birthdate: user.birthday,
      gender: user.gender,
      city: user.city,
      address: user.address,
      height: user.height,
      weight: user.weight,
      age: user.age,
      experience: user.experience,
      achievements: user.achievements?.achievements,
      fitnessGoals: user.fitnessGoals,
      activityLevel: user.activityLevel,
    }
    const u = user.toObject ? user.toObject() : user
    delete u.password

    res.json({
      user: u,
      token,
      role: user.role || null,
      personalInfo,
    })
  } catch (error) {
    res.json({ message: 'Немає доступу.' })
  }
}

// Update user role
export const updateRole = async (req, res) => {
  try {
    const { role } = req.body
    const allowed = ['athlete', 'coach', 'beginner']
    if (!role || !allowed.includes(role)) {
      return res.json({ message: 'Невірна роль.' })
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { role } },
      { new: true }
    )
    if (!user) {
      return res.json({ message: 'Користувача не знайдено.' })
    }
    res.json({ role: user.role, message: 'Роль збережено.' })
  } catch (error) {
    res.json({ message: 'Помилка при збереженні ролі.' })
  }
}

// Update personal info (sports goals and profile data; no telephone)
export const updatePersonalInfo = async (req, res) => {
  try {
    const updates = {}
    const body = req.body || {}

    if (body.birthdate !== undefined && body.birthdate !== '') {
      const d = new Date(body.birthdate)
      if (!Number.isNaN(d.getTime())) updates.birthday = d
    }
    if (body.fullName !== undefined) updates.fullName = body.fullName
    if (body.gender !== undefined) updates.gender = body.gender
    if (body.city !== undefined) updates.city = body.city
    if (body.address !== undefined) updates.address = body.address
    if (body.height !== undefined && body.height !== '') {
      const n = Number(body.height)
      if (!Number.isNaN(n)) updates.height = n
    }
    if (body.weight !== undefined && body.weight !== '') {
      const n = Number(body.weight)
      if (!Number.isNaN(n)) updates.weight = n
    }
    if (body.age !== undefined) updates.age = body.age
    if (body.experience !== undefined) updates.experience = body.experience
    if (body.experienceYears !== undefined) updates.experience = body.experienceYears
    if (body.fitnessGoals !== undefined) updates.fitnessGoals = body.fitnessGoals
    if (body.activityLevel !== undefined) updates.activityLevel = body.activityLevel
    if (body.achievements !== undefined) {
      const arr = Array.isArray(body.achievements)
        ? body.achievements.map((x) => String(x)).filter(Boolean)
        : [].concat(body.achievements != null ? body.achievements : []).map((x) => String(x)).filter(Boolean)
      updates['achievements.achievements'] = arr
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true }
    )
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено.' })
    }
    const personalInfo = {
      fullName: user.fullName || user.username,
      email: user.email,
      birthdate: user.birthday,
      gender: user.gender,
      city: user.city,
      address: user.address,
      height: user.height,
      weight: user.weight,
      age: user.age,
      experience: user.experience,
      achievements: user.achievements?.achievements,
      fitnessGoals: user.fitnessGoals,
      activityLevel: user.activityLevel,
    }
    return res.status(200).json({ personalInfo, message: 'Дані збережено.' })
  } catch (error) {
    console.error('updatePersonalInfo error:', error)
    return res.status(500).json({ message: 'Помилка при збереженні даних.' })
  }
}
