const schoolYearRouter = require('express').Router()
const schoolYearController = require('../controllers/schoolYearController')
const authMiddleware = require('../middlewares/authentication')
const adminMiddleware = require('../middlewares/administrator')
const notFound = require('./404')

schoolYearRouter.use(authMiddleware)

schoolYearRouter.get('/', schoolYearController.getSchoolYear)
schoolYearRouter.get('/list', schoolYearController.getSchoolYearList)
schoolYearRouter.get('/:id', schoolYearController.getSchoolYearById)

// schoolYearRouter.use(adminMiddleware)

schoolYearRouter.post('/', schoolYearController.createSchoolYear)
schoolYearRouter.put('/:id', schoolYearController.updateSchoolYear)
schoolYearRouter.delete('/:id', schoolYearController.deleteSchoolYear)
schoolYearRouter.use(notFound)

module.exports = schoolYearRouter