const Score = require('../models/Score')
const ScoreLock = require('../models/ScoreLock')
const config = require('../config/config')
const Subject = require('../models/Subject')
const SCORE_WEIGHT = [1, 1, 2, 3]

// điểm trung bình của học sinh trong kì 1 hoặc 2
async function getStudentAvgScoreInSubjectTerm(studentId, subjectId, schoolYearId, term) {
    let subjectScores = await Score.getSubjectScore(studentId, subjectId, schoolYearId, term)
    let i, score_i, kind_i
    let sumScore = 0
    let sumScoreWeight = 0
    let scoreWeight;
    let score = [[], [], [], []]
    for (i = 0; i < subjectScores.length; i++) {
        kind_i = subjectScores[i].kind
        score_i = subjectScores[i].score
        score[kind_i].push(score_i)
        scoreWeight = SCORE_WEIGHT[kind_i]
        sumScore += score_i * scoreWeight
        sumScoreWeight += scoreWeight
    }
    let avgScore = sumScore > 0 ? parseFloat((sumScore / sumScoreWeight).toFixed(1)) : ""
    return [avgScore, score]
}

// PHHS tra cứu điểm
async function getStudentScoreSummary(req, res) {
    try {
        let page = config.pageItem
        let perpage = config.perPageItem
        let subjectList = await Subject.getSubjectList(page, perpage)
        let subjects = subjectList.data
        let i
        let data = []
        for (i = 0; i < subjects.length; i++) {
            let [avgScore1, score1] = await getStudentAvgScoreInSubjectTerm(req.query.studentId, subjects[i].subjectId, req.query.schoolYearId, 1)
            let [avgScore2, score2] = await getStudentAvgScoreInSubjectTerm(req.query.studentId, subjects[i].subjectId, req.query.schoolYearId, 2)
            let avgScoreYear = (avgScore1 && avgScore2) ? (parseFloat(((avgScore1 + avgScore2 * 2) / 3).toFixed(1))) : ""

            data.push({
                subjectName: subjects[i].subjectName,
                avgScore1: avgScore1,
                score1: score1,
                avgScore2: avgScore2,
                score2: score2,
                avgScoreYear: avgScoreYear
            })
        }

        return res.status(200).json({
            success: true,
            data: data
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

//Trả về trạng thái khoá điểm sLock.lock
//lock = 0: unlock và giáo viên có thể sửa điểm
//lock = 1: lock và giáo viên không thể sửa điểm
async function checkLockScore(req, res) {
    try {

        let sLock = await ScoreLock.getScoreLock(req.query.schoolYearId, req.query.term)

        if (!sLock || sLock === undefined) {
            return res.status(400).json({
                success: false,
                message: `Cannot find score lock`
            })
        }

        return res.status(200).json({
            success: true,
            result: sLock
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
//Insert score if not exists
//If exists, update on the score which matched
async function editScore(req, res) {
    try {
        //Return rows affected
        let count = await Score.editScore(req.body)

        if (count == 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot update scores`
            })
        }

        return res.status(200).json({
            success: true,
            result: count
        })

    } catch (error) {
        console.log(error)

        if (error.errno == 409) {
            return res.status(error.errno).json({
                success: false,
                message: error.message
            })
        }

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
    editScore: editScore,
    getStudentScoreSummary: getStudentScoreSummary
}