const accountRouter = require('express').Router()
const accountController = require('../controllers/accountController')
const authMiddleware = require('../middlewares/authentication')
const adminMiddleware = require('../middlewares/administrator')
const imageHelper = require('../helpers/imageHelper')
const notFound = require('./404')

accountRouter.use(authMiddleware.isAuth)

accountRouter.get('/id/:id', accountController.getAccount)
accountRouter.get('/username/:username', accountController.getAccountByUsername)
accountRouter.post('/check-password/:id', accountController.checkPassword)
accountRouter.put('/change-password/:id', accountController.changePassword)
accountRouter.post('/upload-image/', imageHelper, accountController.uploadImage)
accountRouter.get('/image/:userCode', accountController.getImage)

// accountRouter.use(adminMiddleware.isAdmin)

accountRouter.get('/list', accountController.getAccountList)
accountRouter.post('/', accountController.addAccount)
accountRouter.put('/:id', accountController.editAccount)
accountRouter.delete('/:id', accountController.deleteAccount)
accountRouter.use(notFound)

module.exports = accountRouter