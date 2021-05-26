const Score = require('../models/Score')
const ScoreLock = require('../models/ScoreLock')
const SchoolYear = require('../models/SchoolYear')
const config = require('../config/config')

//Trả về trạng thái khoá điểm sLock.lock
//lock = 0: unlock và giáo viên có thể sửa điểm
//lock = 1: lock và giáo viên không thể sửa điểm
async function checkLockScore(req, res) {
    try {
        
        let sLock = await ScoreLock.getScoreLock(req.query.schoolYearId, req.query.term)

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
        let subjectScores = await Score.getSubjectScore(req.query.studentId, req.query.subjectId, req.query.schoolYearId, req.query.term)

        if (subjectScores == null || subjectScores == []) {
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
    try {
        let studentScores = await Score.getStudentScore(req.query.studentId, req.query.schoolYearId, req.query.term)

        if (studentScores == null || studentScores == []) {
            return res.status(400).json({
                success: false,
                message: `Cannot find student's score`
            })
        }

        return res.status(200).json({
            success: true,
            scores: studentScores
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function editScore(req, res) {
    try {
        let score = await Score.getScoreById(req.params.id)

        if (!score) {
            scoreCreate = await Score.createScore(req.body)
            return res.status(200).json({
                success: true,
                result: scoreCreate
            })
        }

        score.studentId = req.body.studentId || score.studentId
        score.teacherId = req.body.teacherId || score.teacherId
        score.subjectId = req.body.subjectId || score.subjectId
        score.schoolYearId = req.body.schoolYearId || score.schoolYearId
        score.kind = req.body.kind || score.kind
        score.score = req.body.score || score.score
        score.term = req.body.term || score.term

        let count = Score.editScore(score)
        if (count == 0) {
            return res.status(400).json({
                success: false,
                message: "Score not found"
            })
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
    checkLockScore: checkLockScore,
    getSubjectScore: getSubjectScore,
    getStudentScore: getStudentScore,
    editScore: editScore
}