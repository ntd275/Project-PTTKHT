const accountRouter = require('express').Router()
const accountController = require('../controllers/accountController')
const authMiddleware = require('../middlewares/authentication')
const adminMiddleware = require('../middlewares/administrator')
const notFound = require('./404')

accountRouter.use(authMiddleware.isAuth)

accountRouter.get('/id/:id', accountController.getAccount)
accountRouter.get('/username/:username', accountController.getAccountByUsername)
accountRouter.put('/change-password/:id', accountController.changePassword)

// accountRouter.use(adminMiddleware.isAdmin)

accountRouter.get('/list', accountController.getAccountList)
accountRouter.post('/', accountController.addAccount)
accountRouter.put('/:id', accountController.editAccount)
accountRouter.delete('/:id', accountController.deleteAccount)
accountRouter.use(notFound)

module.exports = accountRouter