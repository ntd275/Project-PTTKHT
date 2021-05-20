const accountRouter = require('express').Router()
const accountController = require('../controllers/accountController')
const authMiddleware = require('../middlewares/authentication')
const adminMiddleware = require('../middlewares/administrator')
const notFound = require('./404')

accountRouter.use(authMiddleware)

accountRouter.get('/:id', accountController.getAccount)
accountRouter.get('/:username', accountController.getAccountByUsername)

// accountRouter.use(adminMiddleware)

accountRouter.get('/list', accountController.getAccountList)
accountRouter.post('/', accountController.addAccount)
accountRouter.put('/:id', accountController.editAccount)
accountRouter.delete('/:id', accountController.deleteAccount)
accountRouter.use(notFound)

module.exports = accountRouter