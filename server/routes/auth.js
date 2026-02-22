import { Router } from 'express'
import { register, login, getMe, updateRole, updatePersonalInfo } from '../controllers/auth.js'
import { checkAuth } from '../utils/checkAuth.js'

const router = new Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', checkAuth, getMe)
router.put('/role', checkAuth, updateRole)
router.put('/personal-info', checkAuth, updatePersonalInfo)

export default router
