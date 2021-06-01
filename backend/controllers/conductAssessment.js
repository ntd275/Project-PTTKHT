const Conduct = require('../models/Conduct')
const config = require('../config/config')

async function getStudentConduct(req, res) {
    try {
        let studentId = req.query.studentId
        let schoolYearId = req.query.schoolYearId
        let term = req.query.term

        let conduct = await Conduct.getConduct(studentId, schoolYearId, term)

        if (conduct === undefined) {
            conduct = {}
        }

        return res.status(200).json({
            success: true,
            result: conduct
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}
async function getClassConduct(req, res) {
    try {
        let conducts = await Conduct.getClassConduct(req.query.classId, req.query.schoolYearId, req.query.term)

        return res.status(200).json({
            success: true,
            result: conducts
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function assessConduct(req, res) {
    try {
        //Check conduct validation
        if (req.body.conduct < 0 || req.body.conduct > 3) {
            return res.status(400).json({
                success: false,
                message: "conduct not valid"
            })
        }

        let conduct = await Conduct.getConduct(req.body.studentId, req.body.schoolYearId, req.body.term)

        let count = 0
        if (conduct === undefined || !conduct) { //If not existed
            count = await Conduct.createConduct(req.body)
        } else { //If existed
            count = await Conduct.updateConduct(req.body)
        }

        return res.status(200).json({
            success: true,
            result: count
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

module.exports = {
    getStudentConduct: getStudentConduct,
    getClassConduct: getClassConduct,
    assessConduct: assessConduct
}