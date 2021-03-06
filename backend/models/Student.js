const knex = require('./database')

exports.getStudentList = async (page, perpage) => {
    return knex.select().table('Student').paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.getStudent = async (studentId) => {
    return knex('Student').where('studentId', studentId).first()
}

exports.getStudentByCode = async (studentCode) => {
    return knex('Student').where('studentCode', studentCode).first()
}

exports.getStudentByName = async (studentName, page, perpage) => {
    return knex('Student').where('studentName', 'like', `%${studentName}%`).paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.searchStudent = async (query) => {
    return knex('Student')
        .where('studentName', 'like', `%${query}%`)
        .orWhere('studentCode', 'like', `%${query}%`)
}

exports.createStudent = async (data) => {
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

    return knex('Student').insert([
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

    return knex('Student')
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

exports.uploadImage = async (studentCode, imagePath) => {
    return knex('Student').where('studentCode', studentCode).update("image", imagePath)
}

exports.getImage = async (studentCode) => {
    return knex('Student').select("image").where('studentCode', studentCode).first()
}

exports.deleteStudent = async (studentId) => {
    return knex('Student').where('studentId', studentId).del()
}

