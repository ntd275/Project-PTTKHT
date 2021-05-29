const studentRouter = require('express').Router()
const studentController = require('../controllers/studentController')
const authMiddleware = require('../middlewares/authentication')
const adminMiddleware = require('../middlewares/administrator')
const notFound = require('./404')

studentRouter.use(authMiddleware.isAuth)

studentRouter.get('/list', studentController.getStudentList)
studentRouter.get('/id/:id', studentController.getStudent)
studentRouter.get('/code/:code', studentController.getStudentByCode)
studentRouter.get('/name/:name', studentController.getStudentByName)

// studentRouter.use(adminMiddleware)

studentRouter.post('/', studentController.createStudent)
studentRouter.put('/id/:id', studentController.updateStudent)
studentRouter.delete('/id/:id', studentController.deleteStudent)

studentRouter.use(notFound)

module.exports = studentRouter