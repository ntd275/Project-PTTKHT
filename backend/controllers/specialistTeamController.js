const SpecialistTeam = require("../models/SpecialistTeam")
const config = require('../config/config')

async function getSpecialistTeamList(req, res) {
    try {
        let page = parseInt(req.query.page) || config.pageItem
        let perpage = parseInt(req.query.perpage) || config.perPageItem
        let sTeamList = await SpecialistTeam.getSpecialistTeamList(page, perpage)

        return res.status(200).json({
            success: true,
            result: sTeamList
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function getSpecialistTeam(req, res) {
    try {
        let sTeam = await SpecialistTeam.getSpecialistTeam(req.params.id)
        return res.status(200).json({
            success: true,
            result: sTeam
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function createSpecialistTeam(req, res) {
    try {
        let sTeam = await SpecialistTeam.createSpecialistTeam(req.body)
        return res.status(200).json({
            success: true,
            result: sTeam
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: err
        })
    }

}

async function deleteSpecialistTeam(req, res) {
    try {
        let count = await SpecialistTeam.deleteSpecialistTeam(req.params.id)
        return res.status(200).json({
            success: true,
            result: count
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function updateSpecialistTeam(req, res) {
    try {
        let sTeam = await SpecialistTeam.getSpecialistTeam(req.params.id)
        sTeam.specialistName = req.body.specialistName || sTeam.specialistName
        sTeam.description = req.body.description || sTeam.description

        let count = await SpecialistTeam.updateSpecialistTeam(req.params.id, sTeam)
        if (count == 0) {
            return res.status(404).json({
                success: false,
                message: "Specialist team not found"
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
            message: err
        })
    }
}

module.exports = {
    getSpecialistTeamList: getSpecialistTeamList,
    getSpecialistTeam: getSpecialistTeam,
    createSpecialistTeam: createSpecialistTeam,
    deleteSpecialistTeam: deleteSpecialistTeam,
    updateSpecialistTeam: updateSpecialistTeam
}