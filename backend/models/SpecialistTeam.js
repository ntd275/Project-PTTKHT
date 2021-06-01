const knex = require('./database')

exports.getSpecialistTeamList = async (page, perpage) => {
    return knex.select().table('SpecialistTeam').paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.getSpecialistTeam = async (id) => {
    return knex('SpecialistTeam').where('specialistTeamId', id).first()
}

exports.getSpecialistTeamByName = async(sTeamName, page, perpage) => {
    return knex('SpecialistTeam').where('specialistName', 'like', sTeamName).paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.createSpecialistTeam = async (data) => {
    return knex('SpecialistTeam').insert([
        {
            specialistName: data.specialistName,
            description: data.description
        }
    ])
}

exports.updateSpecialistTeam = async (id, data) => {
    return knex('SpecialistTeam')
    .where('specialistTeamId', id)
    .update({
        specialistName: data.specialistName,
        description: data.description
    })
}

exports.deleteSpecialistTeam = async (specialistTeamId) => {
    return knex('SpecialistTeam').where('specialistTeamId', specialistTeamId).del()
}

