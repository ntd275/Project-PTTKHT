const homeroomTeacherAssignmentRouter = require('express').Router()
const homeroomTeacherAssignmentController = require('../controllers/homeroomTeacherAssignmentController')
const authMiddleware = require('../middlewares/authentication')
const adminMiddleware = require('../middlewares/administrator')
const notFound = require('./404')

homeroomTeacherAssignmentRouter.use(authMiddleware.isAuth)

homeroomTeacherAssignmentRouter.get('/list', homeroomTeacherAssignmentController.getHomeroomTeacherAssignmentList)
homeroomTeacherAssignmentRouter.get('/id/:id', homeroomTeacherAssignmentController.getHomeroomTeacherAssignment)
homeroomTeacherAssignmentRouter.get('/search', homeroomTeacherAssignmentController.searchHomeroomTeacherAssignment)

// homeroomTeacherAssignmentRouter.use(adminMiddleware)

homeroomTeacherAssignmentRouter.post('/', homeroomTeacherAssignmentController.createHomeroomTeacherAssignment)
homeroomTeacherAssignmentRouter.delete('/id/:id', homeroomTeacherAssignmentController.deleteHomeroomTeacherAssignment)
homeroomTeacherAssignmentRouter.put('/id/:id', homeroomTeacherAssignmentController.updateHomeroomTeacherAssignment)

homeroomTeacherAssignmentRouter.use(notFound)

module.exports = homeroomTeacherAssignmentRouter