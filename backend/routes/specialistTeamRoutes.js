const sTeamRouter = require('express').Router()
const sTeamController = require('../controllers/specialistTeamController')
const authMiddleware = require('../middlewares/authentication')
const adminMiddleware = require('../middlewares/administrator')
const notFound = require('./404')

sTeamRouter.use(authMiddleware.isAuth)

sTeamRouter.get('/list', sTeamController.getSpecialistTeamList)
sTeamRouter.get('/id/:id', sTeamController.getSpecialistTeam)

// sTeamRouter.use(adminMiddleware)

sTeamRouter.post('/', sTeamController.createSpecialistTeam)
sTeamRouter.put('/id/:id', sTeamController.updateSpecialistTeam)
sTeamRouter.delete('/id/:id', sTeamController.deleteSpecialistTeam)

sTeamRouter.use(notFound)

module.exports = sTeamRouter