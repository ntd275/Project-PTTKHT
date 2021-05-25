const scoreRouter = require('express').Router()
const scoreController = require('../controllers/scoreController')
const authMiddleware = require('../middlewares/authentication')
const adminMiddleware = require('../middlewares/administrator')
const teacherMiddleware = require('../middlewares/teacher')
const notFound = require('./404')

scoreRouter.use(authMiddleware.isAuth)

scoreRouter.get('/check-lock', scoreController.checkLockScore)
scoreRouter.get('/student/subject-score', scoreController.getSubjectScore)
scoreRouter.get('/student/score', scoreController.getStudentScore)

scoreRouter.use(teacherMiddleware.isTeacher)

scoreRouter.put('/', scoreController.editScore)
scoreRouter.use(notFound)

module.exports = scoreRouter
