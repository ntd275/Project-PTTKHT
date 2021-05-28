const specialistAssignmentRouter = require('express').Router()
const specialistAssignmentController = require('../controllers/specialistAssignmentController')
const authMiddleware = require('../middlewares/authentication')
const adminMiddleware = require('../middlewares/administrator')
const notFound = require('./404')

specialistAssignmentRouter.use(authMiddleware.isAuth)

specialistAssignmentRouter.get('/list', specialistAssignmentController.getSpecialistAssignmentList)
specialistAssignmentRouter.get('/id/:id', specialistAssignmentController.getSpecialistAssignment)
specialistAssignmentRouter.get('/search', specialistAssignmentController.searchSpecialistAssignment)

// specialistAssignmentRouter.use(adminMiddleware)

specialistAssignmentRouter.post('/', specialistAssignmentController.createSpecialistAssignment)
specialistAssignmentRouter.delete('/id/:id', specialistAssignmentController.deleteSpecialistAssignment)

specialistAssignmentRouter.use(notFound)

module.exports = specialistAssignmentRouter