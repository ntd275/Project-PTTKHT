const studentRouter = require('express').Router()
const studentController = require('../controllers/studentController')
const authMiddleware = require('../middlewares/authentication')
const adminMiddleware = require('../middlewares/administrator')
const notFound = require('./404')

studentRouter.use(authMiddleware.isAuth)

studentRouter.get('/list', studentController.getTeacherList)
studentRouter.get('/id/:id', studentController.getTeacher)

// studentRouter.use(adminMiddleware)

studentRouter.post('/', studentController.createStudent)
studentRouter.put('/id/:id', studentController.updateStudent)
studentRouter.delete('/id/:id', studentController.deleteStudent)

studentRouter.use(notFound)

module.exports = studentRouter