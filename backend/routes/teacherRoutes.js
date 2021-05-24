const teacherRouter = require('express').Router()
const teacherController = require('../controllers/teacherController')
const authMiddleware = require('../middlewares/authentication')
const adminMiddleware = require('../middlewares/administrator')
const notFound = require('./404')

teacherRouter.use(authMiddleware.isAuth)

teacherRouter.get('/list', teacherController.getTeacherList)
teacherRouter.get('/id/:id', teacherController.getTeacher)

// teacherRouter.use(adminMiddleware)

teacherRouter.post('/', teacherController.createTeacher)
teacherRouter.put('/id/:id', teacherController.updateTeacher)
teacherRouter.delete('/id/:id', teacherController.deleteTeacher)

teacherRouter.use(notFound)

module.exports = teacherRouter