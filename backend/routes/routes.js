const notFound = require('./404')
const authRouter = require('./authRoutes')

module.exports = function (app) {
  app.use('/auth', authRouter)
  app.use(notFound)
}