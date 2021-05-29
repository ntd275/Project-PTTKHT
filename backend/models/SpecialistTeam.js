const knex = require('./database')

exports.getSpecialistTeamList = async (page, perpage) => {
    return await knex.select().table('SpecialistTeam').paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.getSpecialistTeam = async (id) => {
    return await knex('SpecialistTeam').where('specialistTeamId', id).first()
}

exports.getSpecialistTeamByName = async(sTeamName) => {
    return await knex('SpecialistTeam').where('specialistName', 'like', sTeamName)
}

exports.createSpecialistTeam = async (data) => {
    return await knex('SpecialistTeam').insert([
        {
            specialistName: data.specialistName,
            description: data.description
        }
    ])
}

exports.updateSpecialistTeam = async (id, data) => {
    return await knex('SpecialistTeam')
    .where('specialistTeamId', id)
    .update({
        specialistName: data.specialistName,
        description: data.description
    })
}

exports.deleteSpecialistTeam = async (specialistTeamId) => {
    return await knex('SpecialistTeam').where('specialistTeamId', specialistTeamId).del()
}

