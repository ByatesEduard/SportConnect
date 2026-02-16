import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validationEmail } from '../validation/auth.js'

// Register user
export const register = async (req, res) => {
  try { 
    let { username, email, password, telephone } = req.body

    if (!username || !email || !password) {
      return res.json({ message: 'Заполните все поля' })
    }

    email = email.trim().toLowerCase()
    username = username.trim()

    if (!validationEmail(email)) {
      return res.json({
        message: 'Некорректный email',
      })
    }
    
    // Check if username already exists
    const isUsernameUsed = await User.findOne({ username })
    if (isUsernameUsed) {
      return res.json({
        message: 'Данный username уже занят.',
      })
    }

    // Check if email already exists
    const isEmailUsed = await User.findOne({ email })
    if (isEmailUsed) {
      return res.json({
        message: 'Данный email уже занят.',
      })
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    const newUser = new User({
      username,
      email,
      password: hash,
      telephone,
    })

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )
    await newUser.save()

    return res.json({
      newUser,
      token,
      message: 'Регистрация прошла успешно.',
    })
  } catch (error) {
    console.log(error)
    res.json({ message: 'Ошибка при создании пользователя.' })
  }
}

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (!user) {
            return res.json({
                message: 'Такого юзера не существует.',
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.json({
                message: 'Неверный пароль.',
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' },
        )

        res.json({
            token,
            user,
            message: 'Вы вошли в систему.',
        })
    } catch (error) {
        res.json({ message: 'Ошибка при авторизации.' })
    }
}

// Get Me
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        if (!user) {
            return res.json({
                message: 'Такого юзера не существует.',
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' },
        )

        res.json({
            user,
            token,
        })
    } catch (error) {
        res.json({ message: 'Нет доступа.' })
    }
}
