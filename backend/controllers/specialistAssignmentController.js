const SpecialistAssignment = require('../models/SpecialistAssignment')
const config = require('../config/config')

async function searchSpecialistAssignment(req, res) {
    try {
        let page = req.query.page || config.pageItem
        let perpage = req.query.perpage || config.perPageItem
        let searchItems = {};
        searchItems.schoolYearId = req.query.schoolYearId;
        searchItems.teacherId = req.query.teacherId;
        searchItems.specialistTeamId = req.query.specialistTeamId;

        let specialistAssignmentList = await SpecialistAssignment.searchSpecialistAssignment(searchItems, page, perpage)

        return res.status(200).json({
            success: true,
            result: specialistAssignmentList
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function getSpecialistAssignmentList(req, res) {
    try {
        let page = req.query.page || config.pageItem
        let perpage = req.query.perpage || config.perPageItem
        let specialistAssignmentList = await SpecialistAssignment.getSpecialistAssignmentList(page, perpage)

        return res.status(200).json({
            success: true,
            result: specialistAssignmentList
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function getSpecialistAssignment(req, res) {
    try {
        let specialistAssignment = await SpecialistAssignment.getSpecialistAssignment(req.params.id)

        return res.status(200).json({
            success: true,
            result: specialistAssignment
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function createSpecialistAssignment(req, res) {
    try {
        let specialistAssignment = await SpecialistAssignment.createSpecialistAssignment(req.body)

        return res.status(200).json({
            success: true,
            result: specialistAssignment
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function deleteSpecialistAssignment(req, res) {
    try {
        //Return number of affected rows
        let count = await SpecialistAssignment.deleteSpecialistAssignment(req.params.id)

        if (!count) {
            return res.status(404).json({
                success: false,
                message: "SpecialistAssignment not found"
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
    createSpecialistAssignment: createSpecialistAssignment,
    deleteSpecialistAssignment: deleteSpecialistAssignment,
    getSpecialistAssignmentList: getSpecialistAssignmentList,
    getSpecialistAssignment: getSpecialistAssignment,
    searchSpecialistAssignment: searchSpecialistAssignment
}