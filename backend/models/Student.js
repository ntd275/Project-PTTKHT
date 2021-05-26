const knex = require('./database')

exports.getStudentList = async () => {
    return await knex.select().table('Student')
}

exports.getStudent = async (studentId) => {
    return await knex('Student').where('studentId', studentId).first()
}

exports.createStudent = async (data) => {
    let dateOfParty = await new Date(data.dateOfParty).toISOString().slice(0,10).replace('T', ' ')
    let dateOfUnion = await new Date(data.dateOfUnion).toISOString().slice(0,10).replace('T', ' ')

    return await knex('Student').insert([
        {
            studentCode: data.studentCode,
            studentName: data.studentName,
            address: data.address,
            permanentResidence: data.permanentResidence,
            gender: data.gender,
            pId: data.pId,
            image: data.image,
            dateOfBirth: data.dateOfBirth,
            email: data.email,
            phoneNumber: data.phoneNumber,
            dateOfParty: dateOfParty,
            dateOfUnion: dateOfUnion,
            accountName: data.accountName,
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
    let dateOfParty = await new Date(data.dateOfParty).toISOString().slice(0,10).replace('T', ' ')
    let dateOfUnion = await new Date(data.dateOfUnion).toISOString().slice(0,10).replace('T', ' ')
    
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
            dateOfBirth: data.dateOfBirth,
            email: data.email,
            phoneNumber: data.phoneNumber,
            dateOfParty: dateOfParty,
            dateOfUnion: dateOfUnion,
            accountName: data.accountName,
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

