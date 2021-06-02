const knex = require('./database')

exports.getTeacherList = async (page, perpage) => {
    return knex.select().table('Teacher').paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.getTeacher = async (teacherId) => {
    return knex('Teacher').where('teacherId', teacherId).first()
}

exports.getTeacherByCode = async (teacherCode) => {
    return knex('Teacher').where('teacherCode', teacherCode).first()
}

exports.getTeacherByName = async (teacherName, page, perpage) => {
    return knex('Teacher').where('teacherName', 'like', `%${teacherName}%`).paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.searchTeacher = async (name, code) => {
    return knex('Teacher')
        .where('teacherName', 'like', `%${name}%`)
        .orWhere('teacherCode', 'like', `%${code}%`)
}

exports.createTeacher = async (data) => {
    let dateOfParty = await new Date(data.dateOfParty).toISOString().slice(0, 10).replace('T', ' ')
    let dateOfUnion = await new Date(data.dateOfUnion).toISOString().slice(0, 10).replace('T', ' ')
    let dateOfBirth = await new Date(data.dateOfBirth).toISOString().slice(0, 10).replace('T', ' ')

    return knex('Teacher').insert([
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
    let dateOfBirth = null;
    if (data.dateOfBirth != null && data.dateOfBirth.length != 0) {
        dateOfBirth = await new Date(data.dateOfBirth).toISOString().slice(0, 10).replace('T', ' ')
    }

    let dateOfParty = null;
    if (data.dateOfParty != null && data.dateOfParty.length != 0) {
        dateOfParty = await new Date(data.dateOfParty).toISOString().slice(0, 10).replace('T', ' ')
    }

    let dateOfUnion = null;
    if (data.dateOfUnion != null && data.dateOfUnion.length != 0) {
        dateOfUnion = await new Date(data.dateOfUnion).toISOString().slice(0, 10).replace('T', ' ')
    }

    return knex('Teacher')
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
    return knex('Teacher').where('teacherId', teacherId).del()
}

