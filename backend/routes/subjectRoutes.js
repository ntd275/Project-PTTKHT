const subjectRouter = require('express').Router()
const subjectController = require('../controllers/subjectController')
const authMiddleware = require('../middlewares/authentication')
const adminMiddleware = require('../middlewares/administrator')
const notFound = require('./404')

subjectRouter.use(authMiddleware.isAuth)

subjectRouter.get('/list', subjectController.getSubjectList)
subjectRouter.get('/teaching', subjectController.getTeachingSubjectList)
subjectRouter.get('/id/:id', subjectController.getSubject)

// subjectRouter.use(adminMiddleware)

subjectRouter.post('/', subjectController.createSubject)
subjectRouter.put('/id/:id', subjectController.updateSubject)
subjectRouter.delete('/id/:id', subjectController.deleteSubject)

subjectRouter.use(notFound)

module.exports = subjectRouter