const teachingAssignmentRouter = require('express').Router()
const teachingAssignmentController = require('../controllers/teachingAssignmentController')
const authMiddleware = require('../middlewares/authentication')
const adminMiddleware = require('../middlewares/administrator')
const notFound = require('./404')

teachingAssignmentRouter.use(authMiddleware.isAuth)

teachingAssignmentRouter.get('/list', teachingAssignmentController.getTeachingAssignmentList)
teachingAssignmentRouter.get('/id/:id', teachingAssignmentController.getTeachingAssignment)
teachingAssignmentRouter.get('/search', teachingAssignmentController.searchTeachingAssignment)

// teachingAssignmentRouter.use(adminMiddleware)

teachingAssignmentRouter.post('/', teachingAssignmentController.createTeachingAssignment)
teachingAssignmentRouter.delete('/id/:id', teachingAssignmentController.deleteTeachingAssignment)

teachingAssignmentRouter.use(notFound)

module.exports = teachingAssignmentRouter