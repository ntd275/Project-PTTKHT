const notFound = require('./404')
const authRouter = require('./authRoutes')
const accountRouter = require('./accountRoutes')
const schoolYearRouter = require('./schoolYearRoutes')

module.exports = function (app) {
  app.use('/auth', authRouter)
  app.use('/account', accountRouter)
  app.use('/school-year', schoolYearRouter)
  app.use(notFound)
}