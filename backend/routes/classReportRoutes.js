const classReportRouter = require('express').Router()
const classReportController = require('../controllers/classReportController')
const authMiddleware = require('../middlewares/authentication')
const adminMiddleware = require('../middlewares/administrator')
const notFound = require('./404')

classReportRouter.use(authMiddleware.isAuth)

classReportRouter.get('/subject', classReportController.getSubjectReport)
// classRouter.use(adminMiddleware)

classReportRouter.use(notFound)

module.exports = classReportRouter