const scoreLockRouter = require('express').Router()
const scoreLockController = require('../controllers/scoreLockController')
const authMiddleware = require('../middlewares/authentication')
const adminMiddleware = require('../middlewares/administrator')
const notFound = require('./404')

scoreLockRouter.use(authMiddleware.isAuth)
// scoreLockRouter.use(adminMiddleware)

scoreLockRouter.get('/list', scoreLockController.getScoreLockList)
scoreLockRouter.get('/id/:id', scoreLockController.getScoreLock)
scoreLockRouter.put('/lock', scoreLockController.lock)
scoreLockRouter.put('/unlock', scoreLockController.unlock)
scoreLockRouter.post('/', scoreLockController.createScoreLock)
scoreLockRouter.delete('/id/:id', scoreLockController.deleteScoreLock)

scoreLockRouter.use(notFound)

module.exports = scoreLockRouter