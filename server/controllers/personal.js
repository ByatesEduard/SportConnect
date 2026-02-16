import User from '../models/User.js'


export const updatePersonal = async (req, res) => {
  try {
    const userId = req.userId;

    const updates = {};
    const allowedFields = [
      'birthday', 'city', 'gender', 'role',
      'height', 'weight', 'age', 'experience', 'achievements'
    ];

    for (let key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[`personal.${key}`] = req.body[key];
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    res.json({
      message: 'Персональні дані оновлено',
      personal: user.personal
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};
