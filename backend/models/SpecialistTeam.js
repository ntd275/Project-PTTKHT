const knex = require('./database')

exports.getSpecialistTeamList = async (page, perpage) => {
    return await knex.select().table('SpecialistTeam').paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.getSpecialistTeam = async (specialistTeamId) => {
    return await knex('SpecialistTeam').where('specialistTeamId', specialistTeamId).first()
}

exports.createSpecialistTeam = async (sTeam) => {
    return await knex('SpecialistTeam').insert([
        {
            specialistName: sTeam.specialistName,
            description: sTeam.description
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

