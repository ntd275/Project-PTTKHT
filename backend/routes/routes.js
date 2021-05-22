const notFound = require('./404')
const authRouter = require('./authRoutes')
const accountRouter = require('./accountRoutes')
const schoolYearRouter = require('./schoolYearRoutes')
const specialistTeamRouter = require('./specialistTeamRoutes')
const classRouter = require('./classRoutes')
const subjectRouter = require('./subjectRoutes')

module.exports = function (app) {
  app.use('/auth', authRouter)
  app.use('/account', accountRouter)
  app.use('/school-year', schoolYearRouter)
  app.use('/specialist-team', specialistTeamRouter)
  app.use('/class', classRouter)
  app.use('/subject', subjectRouter)
  app.use(notFound)
}