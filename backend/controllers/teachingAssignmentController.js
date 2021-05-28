const TeachingAssignment = require('../models/TeachingAssignment')
const config = require('../config/config')

async function searchTeachingAssignment(req, res) {
    try {
        let page = req.query.page || config.pageItem
        let perpage = req.query.perpage || config.perPageItem
        let searchItems = {};
        searchItems.schoolYearId = req.query.schoolYearId;
        searchItems.teacherId = req.query.teacherId;
        searchItems.classId = req.query.classId;
        searchItems.subjectId = req.query.subjectId;

        let teachingAssignmentList = await TeachingAssignment.searchTeachingAssignment(searchItems, page, perpage)

        return res.status(200).json({
            success: true,
            result: teachingAssignmentList
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function getTeachingAssignmentList(req, res) {
    try {
        let page = req.query.page || config.pageItem
        let perpage = req.query.perpage || config.perPageItem
        let teachingAssignmentList = await TeachingAssignment.getTeachingAssignmentList(page, perpage)

        return res.status(200).json({
            success: true,
            result: teachingAssignmentList
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function getTeachingAssignment(req, res) {
    try {
        let teachingAssignment = await TeachingAssignment.getTeachingAssignment(req.params.id)

        return res.status(200).json({
            success: true,
            result: teachingAssignment
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function createTeachingAssignment(req, res) {
    try {
        let teachingAssignment = await TeachingAssignment.createTeachingAssignment(req.body)

        return res.status(200).json({
            success: true,
            result: teachingAssignment
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function deleteTeachingAssignment(req, res) {
    try {
        //Return number of affected rows
        let count = await TeachingAssignment.deleteTeachingAssignment(req.params.id)

        if (!count) {
            return res.status(404).json({
                success: false,
                message: "TeachingAssignment not found"
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
    createTeachingAssignment: createTeachingAssignment,
    deleteTeachingAssignment: deleteTeachingAssignment,
    getTeachingAssignmentList: getTeachingAssignmentList,
    getTeachingAssignment: getTeachingAssignment,
    searchTeachingAssignment: searchTeachingAssignment
}