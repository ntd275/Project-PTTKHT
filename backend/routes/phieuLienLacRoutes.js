const phieuLienLacRouter = require('express').Router()
const phieuLienLacController = require('../controllers/phieuLienLacController')
const authMiddleware = require('../middlewares/authentication')
const adminMiddleware = require('../middlewares/administrator')
const teacherMiddleware = require('../middlewares/teacher')
const notFound = require('./404')

phieuLienLacRouter.use(authMiddleware.isAuth)

phieuLienLacRouter.get('/', phieuLienLacController.getPll)

phieuLienLacRouter.use(notFound)

module.exports = phieuLienLacRouter
