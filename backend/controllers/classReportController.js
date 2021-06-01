const Score = require('../models/Score')
const StudentAssignment = require('../models/StudentAssignment')
const Subject = require('../models/Subject')
const config = require('../config/config')
const SCORE_WEIGHT = [1, 1, 2, 3]
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
async function getSubjectReport(req, res) {
    try {
        let page = parseInt(req.query.page) || config.pageItem
        let perpage = parseInt(req.query.perpage) || config.perPageItem
        let searchItems = {};
        searchItems.schoolYearId = req.query.schoolYearId;
        searchItems.classId = req.query.classId;
        let studentAssignmentList = await StudentAssignment.searchStudentAssignment(searchItems, page, perpage)
        let subjectList = await Subject.getSubjectList(page, perpage)

        let students = studentAssignmentList.data
        let subjects = subjectList.data
        let nStudents = students.length
        let i
        let data = []
        for (i = 0; i < subjects.length; i++) {
            if (subjects[i].subjectCode != "THEDUC") {
                let nGioi = 0, nNuGioi = 0,
                    nKha = 0, nNuKha = 0,
                    nTB = 0, nNuTB = 0,
                    nYeu = 0, nNuYeu = 0,
                    nKem = 0, nNuKem = 0;
                let j
                for (j = 0; j < students.length; j++) {
                    let avgScore = await getStudentAvgScoreInSubject(students[j].studentId, subjects[i].subjectId, req.query.schoolYearId, req.query.term)
                    if (avgScore >= 8.0) {
                        nGioi += 1
                        if (students[j].gender == 0) {
                            nNuGioi += 1
                        }
                    } else if (avgScore >= 6.5) {
                        nKha += 1
                        if (students[j].gender == 0) {
                            nNuKha += 1
                        }
                    } else if (avgScore >= 5.0) {
                        nTB += 1
                        if (students[j].gender == 0) {
                            nNuTB += 1
                        }
                    } else if (avgScore >= 3.5) {
                        nYeu += 1
                        if (students[j].gender == 0) {
                            nNuYeu += 1
                        }
                    } else {
                        nKem += 1
                        if (students[j].gender == 0) {
                            nNuKem += 1
                        }
                    }
                }
                let tlGioi = parseFloat((nGioi/nStudents).toFixed(2)), 
                    tlNuGioi = parseFloat((nNuGioi/nStudents).toFixed(2)),
                    tlKha = parseFloat((nKha/nStudents).toFixed(2)), 
                    tlNuKha = parseFloat((nNuKha/nStudents).toFixed(2)),
                    tlTB = parseFloat((nTB/nStudents).toFixed(2)), 
                    tlNuTB = parseFloat((nNuTB/nStudents).toFixed(2)),
                    tlYeu = parseFloat((nYeu/nStudents).toFixed(2)), 
                    tlNuYeu = parseFloat((nNuYeu/nStudents).toFixed(2)),
                    tlKem = parseFloat((nKem/nStudents).toFixed(2)), 
                    tlNuKem = parseFloat((nNuKem/nStudents).toFixed(2))
                data.push({
                    "subjectName": subjects[i].subjectName,
                    "nGioi": nGioi, "nNuGioi": nNuGioi,
                    "nKha": nKha, "nNuKha": nNuKha,
                    "nTB": nTB, "nNuTB": nNuTB,
                    "nYeu": nYeu, "nNuYeu": nNuYeu,
                    "nKem": nKem, "nNuKem": nNuKem,
                    "tlGioi": tlGioi, "tlNuGioi": tlNuGioi,
                    "tlKha": tlKha, "tlNuKha": tlNuKha,
                    "tlTB": tlTB, "tlNuTB": tlNuTB,
                    "tlYeu": tlYeu, "tlNuYeu": tlNuYeu,
                    "tlKem": tlKem, "tlNuKem": tlNuKem
                })
            }
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

module.exports = {
    getSubjectReport: getSubjectReport
}