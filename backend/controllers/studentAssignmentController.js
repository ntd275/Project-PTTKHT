const StudentAssignment = require('../models/StudentAssignment')
const config = require('../config/config')

async function searchStudentAssignment(req, res) {
    try {
        let page = parseInt(req.query.page) || config.pageItem
        let perpage = parseInt(req.query.perpage) || config.perPageItem
        let searchItems = {};
        searchItems.schoolYearId = req.query.schoolYearId;
        searchItems.classId = req.query.classId;
        searchItems.studentId = req.query.studentId;

        let studentAssignmentList = await StudentAssignment.searchStudentAssignment(searchItems, page, perpage)

        return res.status(200).json({
            success: true,
            result: studentAssignmentList
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function getStudentAssignmentList(req, res) {
    try {
        let page = parseInt(req.query.page) || config.pageItem
        let perpage = parseInt(req.query.perpage) || config.perPageItem
        let studentAssignmentList = await StudentAssignment.getStudentAssignmentList(page, perpage)

        return res.status(200).json({
            success: true,
            result: studentAssignmentList
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function getStudentAssignment(req, res) {
    try {
        let studentAssignment = await StudentAssignment.getStudentAssignment(req.params.id)

        return res.status(200).json({
            success: true,
            result: studentAssignment
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function createStudentAssignment(req, res) {
    try {
        let studentAssignment = await StudentAssignment.createStudentAssignment(req.body)

        return res.status(200).json({
            success: true,
            result: studentAssignment
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function transformClass(req, res) {
    try {
        let studentAssignmentList = await StudentAssignment.createStudentAssignmentList(req.body.data)

        return res.status(200).json({
            success: true,
            result: studentAssignmentList
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function deleteStudentAssignment(req, res) {
    try {
        //Return number of affected rows
        let count = await StudentAssignment.deleteStudentAssignment(req.params.id)

        if (!count) {
            return res.status(404).json({
                success: false,
                message: "StudentAssignment not found"
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
    createStudentAssignment: createStudentAssignment,
    deleteStudentAssignment: deleteStudentAssignment,
    getStudentAssignmentList: getStudentAssignmentList,
    getStudentAssignment: getStudentAssignment,
    searchStudentAssignment: searchStudentAssignment,
    transformClass: transformClass
}