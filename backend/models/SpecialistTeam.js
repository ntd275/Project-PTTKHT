const knex = require('./database')

exports.getSpecialistTeamList = async () => {
    return await knex.select().table('SpecialistTeam')
}

exports.getSpecialistTeam = async (specialistTeamId) => {
    return await knex('SpecialistTeam').where('specialistTeamId', specialistTeamId).first()
}

exports.deleteSpecialistTeam = async (specialistTeamId) => {
    return await knex('SpecialistTeam').where('specialistTeamId', specialistTeamId).del()
}

