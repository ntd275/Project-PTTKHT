const SchoolYear = require('../models/SchoolYear')
const config = require('../config/config')
const { json } = require('express')

async function getSchoolYearList(req, res) {
    try {
        let page = req.query.page || config.pageItem
        let perpage = req.query.perpage || config.perPageItem
        let schoolYearList = await SchoolYear.getSchoolYearList(page, perpage)

        return res.status(200).json({
            success: true,
            result: schoolYearList
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

//Get the current school year
async function getSchoolYear(req, res) {
    try {
        let schoolYear = await SchoolYear.getSchoolYear()

        console.log(schoolYear);
        return res.status(200).json({
            success: true,
            result: schoolYear
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function getSchoolYearById(req, res) {
    try {
        let schoolYear = await SchoolYear.getSchoolYearById(req.params.id)

        return res.status(200).json({
            success: true,
            school_year: schoolYear
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function createSchoolYear(req, res) {
    try {
        let schoolYear = await SchoolYear.createSchoolYear(req.body)

        return res.status(200).json({
            success: true,
            result: schoolYear
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

async function updateSchoolYear(req, res) {
    try {
        //Get info of current school year that need to be updated
        schoolYear = await SchoolYear.getSchoolYearById(req.params.id)
        //Get update info from request
        schoolYear.schoolYear = req.body.schoolYear || schoolYear.schoolYear
        schoolYear.beginSemester1 = req.body.beginSemester1 || schoolYear.beginSemester1
        schoolYear.endSemester1 = req.body.endSemester1 || schoolYear.endSemester1
        schoolYear.beginSemester2 = req.body.beginSemester2 || schoolYear.beginSemester2
        schoolYear.endSemester2 = req.body.endSemester2 || schoolYear.endSemester2
        schoolYear.description = req.body.description || schoolYear.description

        //Update & check
        //SQL update return number of rows affected
        let count = await SchoolYear.updateSchoolYear(req.params.id, schoolYear)

        if (count == 0) {
            return res.status(404).json({
                success: false,
                message: "School year not found"
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

async function deleteSchoolYear(req, res) {
    try {
        let count = await SchoolYear.deleteSchoolYear(req.params.id)

        if (!count) {
            return res.status(404).json({
                success: false,
                message: "School year not found"
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
    getSchoolYearList: getSchoolYearList,
    getSchoolYear: getSchoolYear,
    createSchoolYear: createSchoolYear,
    updateSchoolYear: updateSchoolYear,
    deleteSchoolYear: deleteSchoolYear,
    getSchoolYearById: getSchoolYearById
}