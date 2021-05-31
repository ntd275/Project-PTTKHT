const studentAssignmentRouter = require('express').Router()
const studentAssignmentController = require('../controllers/studentAssignmentController')
const authMiddleware = require('../middlewares/authentication')
const adminMiddleware = require('../middlewares/administrator')
const notFound = require('./404')

studentAssignmentRouter.use(authMiddleware.isAuth)

studentAssignmentRouter.get('/list', studentAssignmentController.getStudentAssignmentList)
studentAssignmentRouter.get('/id/:id', studentAssignmentController.getStudentAssignment)
studentAssignmentRouter.get('/search', studentAssignmentController.searchStudentAssignment)

// studentAssignmentRouter.use(adminMiddleware)

studentAssignmentRouter.post('/', studentAssignmentController.createStudentAssignment)
studentAssignmentRouter.post('/transform-class', studentAssignmentController.transformClass)
studentAssignmentRouter.delete('/id/:id', studentAssignmentController.deleteStudentAssignment)

studentAssignmentRouter.use(notFound)

module.exports = studentAssignmentRouter