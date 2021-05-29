const classRouter = require('express').Router()
const classController = require('../controllers/classController')
const authMiddleware = require('../middlewares/authentication')
const adminMiddleware = require('../middlewares/administrator')
const notFound = require('./404')

classRouter.use(authMiddleware.isAuth)

classRouter.get('/list', classController.getClassList)
classRouter.get('/id/:id', classController.getClass)
classRouter.get('/homeroom', classController.getHomeroomClass)
classRouter.get('/name/:name', classController.getClassByName)

// classRouter.use(adminMiddleware)

classRouter.post('/', classController.createClass)
classRouter.put('/id/:id', classController.updateClass)
classRouter.delete('/id/:id', classController.deleteClass)

classRouter.use(notFound)

module.exports = classRouter