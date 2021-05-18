const SchoolYear = require('../models/SchoolYear')
const config = require('../config/config')
const { json } = require('express')

async function getSchoolYearList(req, res) {
    try {
        let schoolYearList = await SchoolYear.getSchoolYearList()

        if (!schoolYearList) {
            return res.status(400).json({
                success: false,
                message: "Cannot get school year list"
            })
        }

        return res.status(200).json({
            success: true,
            school_year_list: schoolYearList
        })
    } catch (error) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function getSchoolYear(req, res) {
    try {
        let schoolYear = await SchoolYear.getSchoolYear()

        return res.status(200).json({
            success: true,
            school_year: schoolYear
        })
    } catch (error) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function createSchoolYear(req, res) {
    try {
        let ok = await SchoolYear.createSchoolYear(req.body.schoolYear)

        if (!ok) {
            return res.status(401).json({
                success: false,
                message: "Cannot create school year"
            })
        }

        return res.status(200).json({
            success: true,
            message: "School year created"
        })

    } catch (error) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function updateSchoolYear(req, res) {
    try {
        //Get info of current school year that need to be updated
        schoolYear = await SchoolYear.getSchoolYearById(req.body.schoolYearId)
        //Get update info from request
        schoolYear.schoolYear = schoolYear.schoolYear || req.body.schoolYear
        schoolYear.beginSemester1 = schoolYear.beginSemester1 || req.body.beginSemester1
        schoolYear.endSemester1 = schoolYear.endSemester1 || req.body.endSemester1
        schoolYear.beginSemester2 = schoolYear.beginSemester2 || req.body.beginSemester2
        schoolYear.endSemester2 = schoolYear.endSemester2 || req.body.endSemester2
        schoolYear.description = schoolYear.description || req.body.description 

        //Update & check
        let ok = await SchoolYear.updateSchoolYear(schoolYear)

        if (!ok) {
            return res.status(401).json({
                success: false,
                message: "Cannot update school year"
            })
        }

        return res.status(200).json({
            success: true,
            message: "School year updated"
        })

    } catch (error) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function deleteSchoolYear(req, res) {
    try {
        let ok = await SchoolYear.deleteSchoolYear(req.body.schoolYearId)

        if (!ok) {
            return res.status(401).json({
                success: false,
                message: "Cannot delete school year"
            })
        }

        return res.status(200).json({
            success: true,
            message: "School year deleted"
        })

    } catch (error) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

module.exports = {
    getSchoolYearList: getSchoolYearList,
    getSchoolYear: getSchoolYear,
    createSchoolYear: createSchoolYear,
    updateSchoolYear: updateSchoolYear,
    deleteSchoolYear: deleteSchoolYear
}