const Score = require('../models/Score')
const Conduct = require('../models/Conduct')
const StudentAssignment = require('../models/StudentAssignment')
const Subject = require('../models/Subject')
const Attendance = require('../models/Attendance')
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
        sumAvgScore += await getStudentAvgScoreInSubject(studentId, subjects[i].subjectId, schoolYearId, term)
        nSubjects += 1
    }
    return sumAvgScore > 0 ? parseFloat(sumAvgScore / nSubjects).toFixed(1) : ""
}

async function getPllTerm(studentId, schoolYearId, term) {
    let page = config.pageItem
    let perpage = config.perPageItem
    let searchItems = {};
    searchItems.schoolYearId = schoolYearId;
    searchItems.studentId = studentId;
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
    let termConduct = term > 0 ? term : 2;
    let i, id
    for (i = 0; i < nStudents; i++) {
        if (students[i].studentId == studentId) {
            id = i
        }
        let avgScore = await getStudentAvgScore(students[i].studentId, subjects, schoolYearId, term)
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
        let conduct = await Conduct.getConduct(students[i].studentId, schoolYearId, termConduct)
        conductLevel = conduct ? conduct.conduct : 3
        let title = ""
        if (scoreLevel == 0 && conductLevel == 0) {
            title = "Học sinh giỏi"
        } else if (scoreLevel < 2 && conductLevel < 2) {
            title = "Học sinh tiên tiến"
        }
        if (students[i].studentId == studentId && avgScore === "") {
            return null
        }
        data.push({
            studentName: students[i].studentName,
            gender: students[i].gender,
            avgScore: avgScore,
            conductLevel: conductLevel,
            scoreLevel: scoreLevel,
            scoreTitle: SCORE_LEVEL[scoreLevel],
            conductTitle: CONDUCT_LEVEL[conductLevel],
            title: title,
            note: conduct ? conduct.note : ""
        })
    }
    let rank = 1
    for (i = 0; i < nStudents; i++) {
        if (i != id) {
            if (data[i].avgScore > data[id].avgScore ||
                (data[i].avgScore == data[id].avgScore && data[i].conductLevel < data[id].conductLevel)) {
                rank += 1
            }
        }
    }
    let result = data[id]
    result.rank = rank

    return result
}

async function getPll(req, res) {
    try {
        let [result0, result1, result2] = await Promise.all([
            getPllTerm(req.query.studentId, req.query.schoolYearId, 0),
            getPllTerm(req.query.studentId, req.query.schoolYearId, 1),
            getPllTerm(req.query.studentId, req.query.schoolYearId, 2)
        ])
        if(result1 == null) {
            result1 = {}
            result0 = {}
        }
        if(result2 == null) {
            result2 = {}
            result0 = {}
        }
        let page = config.pageItem
        let perpage = config.perPageItem
        let [attendances1, attendances2] = await Promise.all([
            Attendance.getStudentAttendance(req.query.studentId, req.query.schoolYearId, 1, page, perpage),
            Attendance.getStudentAttendance(req.query.studentId, req.query.schoolYearId, 2, page, perpage),
        ])
        attendances1 = attendances1.data
        attendances2 = attendances2.data
        let nVangCoPhep1 = 0, nVangKoPhep1 = 0, nVangCoPhep2 = 0, nVangKoPhep2 = 0
        let i
        for(i = 0; i < attendances1.length; i++){
            if(attendances1[i].attendance==0){
                nVangCoPhep1 += 1
            } else if(attendances1[i].attendance==1){
                nVangKoPhep1 += 1
            }
        }
        for(i = 0; i < attendances2.length; i++){
            if(attendances2[i].attendance==0){
                nVangCoPhep2 += 1
            } else if(attendances2[i].attendance==1){
                nVangKoPhep2 += 1
            }
        }
        result0.nVangCoPhep = nVangCoPhep1 + nVangCoPhep2
        result0.nVangKoPhep = nVangKoPhep1 + nVangKoPhep2
        result1.nVangCoPhep = nVangCoPhep1
        result1.nVangKoPhep = nVangKoPhep1
        result2.nVangCoPhep = nVangCoPhep2
        result2.nVangKoPhep = nVangKoPhep2
        if(!result0.scoreLevel) {
            result0.isGradeUp = ""
        } else if((result0.scoreLevel && result0.scoreLevel < 3
            && result0.conductLevel && result0.conductLevel < 3
            && (result0.nVangCoPhep + result0.nVangKoPhep <= 45))){
                result0.isGradeUp = "Có"
        } else {
            result0.isGradeUp = "Không"
        }
        return res.status(200).json({
            success: true,
            result0: result0,
            result1: result1,
            result2: result2
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
    getPll: getPll
}