const HomeroomTeacherAssignment = require('../models/HomeroomTeacherAssignment')
const config = require('../config/config')

async function updateHomeroomTeacherAssignment(req, res) {
    try {
        homeroomTeacherAssignment = await HomeroomTeacherAssignment.getHomeroomTeacherAssignment(req.params.id)
        //Check exists
        if (homeroomTeacherAssignment === undefined) {
            return res.status(400).json({
                success: false,
                message: `Cannot find HomeroomTeacherAssignment with id = ${req.params.id}`
            })
        }
        //Get update info from request
        homeroomTeacherAssignment.teacherId = req.body.teacherId || homeroomTeacherAssignment.teacherId
        //Update
        let count = await HomeroomTeacherAssignment.updateHomeroomTeacherAssignment(req.params.id, homeroomTeacherAssignment)
        
        if (count == 0) { //Cannot update
            return res.status(404).json({
                success: false,
                message: `Cannot update HomeroomTeacherAssignment with id = ${req.params.id}`
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

async function searchHomeroomTeacherAssignment(req, res) {
    try {
        let page = parseInt(req.query.page || config.pageItem)
        let perpage = parseInt(req.query.perpage || config.perPageItem)
        let searchItems = {};
        searchItems.schoolYearId = req.query.schoolYearId;
        searchItems.teacherId = req.query.teacherId;
        searchItems.classId = req.query.classId;

        let homeroomTeacherAssignmentList = await HomeroomTeacherAssignment.searchHomeroomTeacherAssignment(searchItems, page, perpage)

        return res.status(200).json({
            success: true,
            result: homeroomTeacherAssignmentList
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function getHomeroomTeacherAssignmentList(req, res) {
    try {
        let page = parseInt(req.query.page) || config.pageItem
        let perpage = parseInt(req.query.perpage) || config.perPageItem
        let homeroomTeacherAssignmentList = await HomeroomTeacherAssignment.getHomeroomTeacherAssignmentList(page, perpage)

        return res.status(200).json({
            success: true,
            result: homeroomTeacherAssignmentList
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function getHomeroomTeacherAssignment(req, res) {
    try {
        let homeroomTeacherAssignment = await HomeroomTeacherAssignment.getHomeroomTeacherAssignment(req.params.id)

        return res.status(200).json({
            success: true,
            result: homeroomTeacherAssignment
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function createHomeroomTeacherAssignment(req, res) {
    try {
        let homeroomTeacherAssignment = await HomeroomTeacherAssignment.createHomeroomTeacherAssignment(req.body)

        return res.status(200).json({
            success: true,
            result: homeroomTeacherAssignment
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function deleteHomeroomTeacherAssignment(req, res) {
    try {
        //Return number of affected rows
        let count = await HomeroomTeacherAssignment.deleteHomeroomTeacherAssignment(req.params.id)

        if (!count) {
            return res.status(404).json({
                success: false,
                message: "HomeroomTeacherAssignment not found"
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
    createHomeroomTeacherAssignment: createHomeroomTeacherAssignment,
    deleteHomeroomTeacherAssignment: deleteHomeroomTeacherAssignment,
    getHomeroomTeacherAssignmentList: getHomeroomTeacherAssignmentList,
    getHomeroomTeacherAssignment: getHomeroomTeacherAssignment,
    searchHomeroomTeacherAssignment: searchHomeroomTeacherAssignment,
    updateHomeroomTeacherAssignment: updateHomeroomTeacherAssignment
}