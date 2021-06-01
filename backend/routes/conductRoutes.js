const ConductRouter = require('express').Router()
const ConductController = require('../controllers/conductAssessment')
const authMiddleware = require('../middlewares/authentication')
const adminMiddleware = require('../middlewares/administrator')
const teacherMiddleware = require('../middlewares/teacher')
const notFound = require('./404')

ConductRouter.use(authMiddleware.isAuth)
ConductRouter.get('/student', ConductController.getStudentConduct)
ConductRouter.get('/class', ConductController.getClassConduct)

ConductRouter.use(teacherMiddleware.isTeacher)
ConductRouter.post('/', ConductController.assessConduct)

ConductRouter.use(notFound)

module.exports = ConductRouter