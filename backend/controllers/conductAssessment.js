const Conduct = require('../models/Conduct')
const config = require('../config/config')

async function getConduct(req, res) {
    try {
        let studentId = req.query.studentId
        let schoolYearId = req.query.schoolYearId
        let term = req.query.term

        let conduct = await Conduct.getConduct(studentId, schoolYearId, term)

        if (conduct == {} || conduct == null) {
            return res.status(400).json({
                success: false,
                message: "Conduct not found"
            })
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

async function assessConduct(req, res) {
    try {
        let conduct = await Conduct.getConduct(req.body.studentId, req.body.schoolYearId, req.body.term)

        if (!conduct) {
            let count = await Conduct.createConduct(req.body)

            return res.status(200).json({
                success: true,
                result: count
            })
        }

        conduct.studentId = req.body.studentId || conduct.studentId
        conduct.classId = req.body.classId || conduct.classId
        conduct.teacherId = req.body.teacherId || conduct.teacherId,
        conduct.schoolYearId = req.body.schoolYearId || conduct.schoolYearId,
        conduct.conduct = req.body.conduct || conduct.conduct
        conduct.term = req.body.term || conduct.term

        let count = await Conduct.updateConduct(conduct)

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
    getConduct: getConduct,
    assessConduct: assessConduct
}