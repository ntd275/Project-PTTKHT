const knex = require('./database')

exports.getStudentList = async (page, perpage) => {
    return await knex.select().table('Student').paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.getStudent = async (studentId) => {
    return await knex('Student').where('studentId', studentId).first()
}

exports.getStudentByCode = async (studentCode) => {
    return await knex('Student').where('studentCode', studentCode).first()
}

exports.getStudentByName = async (studentName) => {
    return await knex('Student').where('studentName', 'like', `%${studentName}`)
}

exports.createStudent = async (data) => {
    let dateOfBirth = await new Date(data.dateOfBirth).toISOString().slice(0, 10).replace('T', ' ')
    let dateOfParty = await new Date(data.dateOfParty).toISOString().slice(0, 10).replace('T', ' ')
    let dateOfUnion = await new Date(data.dateOfUnion).toISOString().slice(0, 10).replace('T', ' ')

    return await knex('Student').insert([
        {
            studentCode: data.studentCode,
            studentName: data.studentName,
            address: data.address,
            permanentResidence: data.permanentResidence,
            gender: data.gender,
            pId: data.pId,
            image: data.image,
            dateOfBirth: dateOfBirth,
            email: data.email,
            phoneNumber: data.phoneNumber,
            dateOfParty: dateOfParty,
            dateOfUnion: dateOfUnion,
            fatherName: data.fatherName,
            fatherPhone: data.fatherPhone,
            fatherMail: data.fatherMail,
            motherName: data.motherName,
            motherPhone: data.motherPhone,
            motherMail: data.motherMail
        }
    ])
}

exports.updateStudent = async (id, data) => {
    let dateOfParty = await new Date(data.dateOfParty).toISOString().slice(0, 10).replace('T', ' ')
    let dateOfUnion = await new Date(data.dateOfUnion).toISOString().slice(0, 10).replace('T', ' ')
    let dateOfBirth = await new Date(data.dateOfBirth).toISOString().slice(0, 10).replace('T', ' ')

    return await knex('Student')
        .where('studentId', id)
        .update({
            studentCode: data.studentCode,
            studentName: data.studentName,
            address: data.address,
            permanentResidence: data.permanentResidence,
            gender: data.gender,
            pId: data.pId,
            image: data.image,
            dateOfBirth: dateOfBirth,
            email: data.email,
            phoneNumber: data.phoneNumber,
            dateOfParty: dateOfParty,
            dateOfUnion: dateOfUnion,
            fatherName: data.fatherName,
            fatherPhone: data.fatherPhone,
            fatherMail: data.fatherMail,
            motherName: data.motherName,
            motherPhone: data.motherPhone,
            motherMail: data.motherMail
        })
}

exports.deleteStudent = async (studentId) => {
    return await knex('Student').where('studentId', studentId).del()
}

