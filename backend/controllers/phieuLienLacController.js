const Score = require('../models/Score')
const Conduct = require('../models/Conduct')
const StudentAssignment = require('../models/StudentAssignment')
const Subject = require('../models/Subject')
const config = require('../config/config')
const SCORE_WEIGHT = [1, 1, 2, 3]
const SCORE_LEVEL = ["Giỏi", "Khá", "Trung bình", "Yếu", "Kém"]
const CONDUCT_LEVEL = ["Tốt", "Khá", "Trung bình", "Yếu"]
async function getStudentAvgScoreInSubjectTerm(studentId, subjectId, schoolYearId, term) {
    let subjectScores = await Score.getSubjectScore(studentId, subjectId, schoolYearId, term)
    let i
    let sumScore = 0
    let sumScoreWeight = 0
    let scoreWeight;
    for (i = 0; i < subjectScores.length; i++) {
        scoreWeight = SCORE_WEIGHT[subjectScores[i].kind]
        sumScore += subjectScores[i].score * scoreWeight
        sumScoreWeight += scoreWeight
    }
    let avgScore = sumScore > 0 ? parseFloat((sumScore / sumScoreWeight).toFixed(1)) : 0
    return avgScore
}
async function getStudentAvgScoreInSubject(studentId, subjectId, schoolYearId, term) {
    if (term == 0) {
        let [avgScore1, avgScore2] = await Promise.all([
            getStudentAvgScoreInSubjectTerm(studentId, subjectId, schoolYearId, 1),
            getStudentAvgScoreInSubjectTerm(studentId, subjectId, schoolYearId, 2)
        ])
        return parseFloat(((avgScore1 + avgScore2 * 2) / 3).toFixed(1))
    }
    return getStudentAvgScoreInSubjectTerm(studentId, subjectId, schoolYearId, term)
}

async function getStudentAvgScore(studentId, subjects, schoolYearId, term) {
    let i
    let sumAvgScore = 0
    let nSubjects = 0
    for (i = 0; i < subjects.length; i++) {
        if (subjects[i].subjectCode != "THEDUC") {
            sumAvgScore += await getStudentAvgScoreInSubject(studentId, subjects[i].subjectId, schoolYearId, term)
            nSubjects += 1
        }
    }
    return parseFloat(sumAvgScore / nSubjects).toFixed(1)
}

async function getPllTerm(req, res) {
    try {
        let page = parseInt(req.query.page) || config.pageItem
        let perpage = parseInt(req.query.perpage) || config.perPageItem
        let searchItems = {};
        searchItems.schoolYearId = req.query.schoolYearId;
        searchItems.studentId = req.query.studentId;
        let studentAssignmentList = await StudentAssignment.searchStudentAssignment(searchItems, page, perpage)
        let classId = studentAssignmentList.data[0].classId
        searchItems.studentId = null
        searchItems.classId = classId
        studentAssignmentList = await StudentAssignment.searchStudentAssignment(searchItems, page, perpage)
        let subjectList = await Subject.getSubjectList(page, perpage)

        let students = studentAssignmentList.data
        let subjects = subjectList.data
        let nStudents = students.length
        let data = []
        let i, id
        for (i = 0; i < nStudents; i++) {
            let studentId = students[i].studentId
            if(studentId == req.query.subjectId){
                id = i
            }
            let avgScore = await getStudentAvgScore(studentId, subjects, req.query.schoolYearId, req.query.term)
            let scoreLevel
            if (avgScore >= 8.0) {
                scoreLevel = 0
            } else if (avgScore >= 6.5) {
                scoreLevel = 1
            } else if (avgScore >= 5.0) {
                scoreLevel = 2
            } else if (avgScore >= 3.5) {
                scoreLevel = 3
            } else {
                scoreLevel = 4
            }
            let term = req.query.term > 0 ? req.query.term : 2;
            let conduct = await Conduct.getConduct(studentId, req.query.schoolYearId, term)
            conductLevel = conduct ? conduct.conduct : 3
            let title = ""
            if (scoreLevel == 0 && conductLevel == 0) {
                title = "Học sinh giỏi"
            } else if (scoreLevel < 2 && conductLevel < 2) {
                title = "Học sinh tiên tiến"
            }
            data.push({
                studentName: students[i].studentName,
                gender: students[i].gender,
                avgScore: avgScore,
                conductLevel: conductLevel,
                scoreLevel: SCORE_LEVEL[scoreLevel],
                conduct: CONDUCT_LEVEL[conductLevel],
                title: title,
                note: conduct ? conduct.node : ""
            })
        }
        let rank = 1
        for (i = 0; i < nStudents; i++) {
            if(i != id) {
                if (data[i].avgScore > data[id].avgScore ||
                    (data[i].avgScore == data[id].avgScore && data[i].conductLevel < data[id].conductLevel)) {
                    rank += 1
                }
            }
        }
        let result = data[id]
        result.rank = rank

        return res.status(200).json({
            success: true,
            data: result
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
    getPllTerm: getPllTerm
}