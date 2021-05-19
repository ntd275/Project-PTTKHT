const SpecialistTeam = require("../models/SpecialistTeam")
const config = require('../config/config')

async function getSpecialistTeamList(req, res) {
    try {
        let page = req.query.page || config.pageItem
        let perpage = req.query.perpage || config.perPageItem
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: err
        })
    }
}

async function getSpecialistTeam(req, res) {

}

async function createSpecialistTeam(req, res) {
    
}

async function deleteSpecialistTeam(req, res) {
    
}

async function updateSpecialistTeam(req, res) {
    
}

module.exports = {
    getSpecialistTeamList: getSpecialistTeamList,
    getSpecialistTeam: getSpecialistTeam,
    createSpecialistTeam: createSpecialistTeam,
    deleteSpecialistTeam: deleteSpecialistTeam,
    updateSpecialistTeam: updateSpecialistTeam
}