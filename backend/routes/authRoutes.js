const authRouter = require('express').Router()
const authMiddleWare = require('../middlewares/authentication')
const authController = require('../controllers/authController')
const notFound = require('./404')

authRouter.post('/login', authController.login)
authRouter.post('/logout', authController.logOut)
authRouter.post('/change_password', authController.changePassword)
authRouter.post('/refresh-token', authController.refreshToken)
authRouter.use(authMiddleWare.isAuth)
authRouter.get('/check-auth', authController.checkAuth)
authRouter.use(notFound);
module.exports = authRouter