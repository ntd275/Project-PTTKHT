const authRouter = require('express').Router()
const authMiddleWare = require('../middlewares/authenication')
const authController = require('../controllers/authController')
const notFound = require('./404')

authRouter.post('/login', authController.login)
authRouter.post('/logout', authController.logOut)
authRouter.post('/refresh-token', authController.refreshToken)
authRouter.post('/register', authController.register)
authRouter.use(authMiddleWare.isAuth)
authRouter.get('/check-auth', authController.checkAuth)
authRouter.use(notFound);
module.exports = authRouter