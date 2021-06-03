const authRouter = require('express').Router()
const authMiddleWare = require('../middlewares/authentication')
const authController = require('../controllers/authController')
const notFound = require('./404')

authRouter.post('/login', authController.login)
authRouter.post('/logout', authController.logOut)
authRouter.post('/send-otp', authController.sendOtp)
authRouter.post('/check-otp', authController.checkOtp)
authRouter.post('/forget-password', authController.forgetPassword)
authRouter.post('/refresh-token', authController.refreshToken)


authRouter.use(authMiddleWare.isAuth)

authRouter.get('/check-auth', authController.checkAuth)

authRouter.use(notFound);
module.exports = authRouter