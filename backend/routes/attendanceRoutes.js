const attendanceRouter = require('express').Router()
const attendanceController = require('../controllers/attendanceController')
const authMiddleware = require('../middlewares/authentication')
const adminMiddleware = require('../middlewares/administrator')
const teacherMiddleware = require('../middlewares/teacher')
const notFound = require('./404')

attendanceRouter.use(authMiddleware.isAuth)

// attendanceRouter.use(teacherMiddleware.isTeacher)

attendanceRouter.get('/class', attendanceController.getClassAttendance)
attendanceRouter.get('/student/:id', attendanceController.getStudentAttendance)
attendanceRouter.put('/', attendanceController.attendStudents)

// attendanceRouter.use(adminMiddleware.isAdmin)
attendanceRouter.get('/list', attendanceController.getAttendanceList)

attendanceRouter.use(notFound)

module.exports = attendanceRouter