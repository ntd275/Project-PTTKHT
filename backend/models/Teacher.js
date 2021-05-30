const knex = require('./database')

exports.getTeacherList = async (page, perpage) => {
    return await knex.select().table('Teacher').paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.getTeacher = async (teacherId) => {
    return await knex('Teacher').where('teacherId', teacherId).first()
}

exports.getTeacherByCode = async (teacherCode) => {
    return await knex('Teacher').where('teacherCode', teacherCode).first()
}

exports.getTeacherByName = async(teacherName, page, perpage) => {
    return await knex('Teacher').where('teacherName', 'like', `%${teacherName}`).paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.createTeacher = async (data) => {
    let dateOfParty = await new Date(data.dateOfParty).toISOString().slice(0, 10).replace('T', ' ')
    let dateOfUnion = await new Date(data.dateOfUnion).toISOString().slice(0, 10).replace('T', ' ')
    let dateOfBirth = await new Date(data.dateOfBirth).toISOString().slice(0, 10).replace('T', ' ')

    return await knex('Teacher').insert([
        {
            teacherCode: data.teacherCode,
            teacherName: data.teacherName,
            dateOfBirth: dateOfBirth,
            gender: data.gender,
            pId: data.pId,
            image: data.image,
            address: data.address,
            permanentResidence: data.permanentResidence,
            email: data.email,
            phoneNumber: data.phoneNumber,
            dateOfParty: dateOfParty,
            dateOfUnion: dateOfUnion,
            civilServantNumber: data.civilServantNumber,
            major: data.major
        }
    ])
}

exports.updateTeacher = async (id, data) => {
    let dateOfParty = await new Date(data.dateOfParty).toISOString().slice(0, 10).replace('T', ' ')
    let dateOfUnion = await new Date(data.dateOfUnion).toISOString().slice(0, 10).replace('T', ' ')
    let dateOfBirth = await new Date(data.dateOfBirth).toISOString().slice(0, 10).replace('T', ' ')

    return await knex('Teacher')
        .where('teacherId', id)
        .update({
            teacherCode: data.teacherCode,
            teacherName: data.teacherName,
            dateOfBirth: dateOfBirth,
            gender: data.gender,
            pId: data.pId,
            image: data.image,
            address: data.address,
            permanentResidence: data.permanentResidence,
            email: data.email,
            phoneNumber: data.phoneNumber,
            dateOfParty: dateOfParty,
            dateOfUnion: dateOfUnion,
            civilServantNumber: data.civilServantNumber,
            major: data.major
        })
}

exports.deleteTeacher = async (teacherId) => {
    return await knex('Teacher').where('teacherId', teacherId).del()
}

