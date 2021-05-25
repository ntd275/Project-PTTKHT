const Score = require('../models/Score')
const ScoreLock = require('../models/ScoreLock')
const SchoolYear = require('../models/SchoolYear')
const config = require('../config/config')

//Trả về trạng thái khoá điểm sLock.lock
//lock = 0: unlock và giáo viên có thể sửa điểm
//lock = 1: lock và giáo viên không thể sửa điểm
async function checkLockScore(req,res) {
    try {
        //Get schoolYear & term
        let sYear = SchoolYear.getSchoolYear()
        let thisDate = await new Date().toISOString().slice(0,10).replace('T','')
        let term = -1
        
        if (thisDate >= sYear.beginSemester1 && thisDate <= sYear.endSemester1) {
            term = 1
        } else if (thisDate >= sYear.beginSemester2 && thisDate <= sYear.endSemester2) {
            term = 2
        }

        if (term == -1) {
            return res.status(400).json({
                success: false,
                message: "Cannot find term that conform date"
            })
        }

        let sLock = ScoreLock.getScoreLock(sYear.schoolYearId, term)

        return res.status(200).json({
            success: true,
            result: sLock.lock
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

//Get score of a student by subject
async function getSubjectScore(req, res) {
    try {
        let subjectScores = Score.getSubjectScore(req.query.studentId, req.query.subjectId, req.query.schoolYearId)

        if (subjectScores == null) {
            return res.status(400).json({
                success: false,
                message: `Cannot find student's subject score`
            })
        }

        return res.status(200).json({
            success: true,
            scores: subjectScores
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

//Get all score of a student
async function getStudentScore(req, res) {

}

async function editScore(req, res) {

}

module.exports = {
    checkLockScore: checkLockScore,
    getSubjectScore: getSubjectScore,
    getStudentScore: getStudentScore,
    editScore: editScore
}