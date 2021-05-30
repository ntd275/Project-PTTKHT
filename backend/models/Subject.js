const knex = require('./database')

exports.getSubjectList = async (page, perpage) => {
    return await knex.select().table('Subject').paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.getSubject = async (subjectId) => {
    return await knex('Subject').where('subjectId', subjectId).first()
}

exports.getTeachingSubjectList = async(teacherId) => {
    // let subQuery = await knex('TeachingAssignment').where('teacherId', teacherId).select('subjectId')
    // return await knex('Subject').where('SubjectId', subQuery)
    return await knex('Subject')
        .join('TeachingAssignment', 'Subject.subjectId', 'TeachingAssignment.subjectId')
        .select('Subject.subjectId', 'Subject.subjectCode', 'Subject.subjectName', 'Subject.description')
        .where('TeachingAssignment.teacherId', teacherId)
}

exports.getSubjectByName = async (subjectName, page, perpage) => {
    return await knex('Subject').where('subjectName', 'like', `%${subjectName}%`).paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.createSubject = async (subject) => {
    return await knex('Subject').insert([
        {
            subjectCode: subject.subjectCode,
            subjectName: subject.subjectName,
            description: subject.description
        }
    ])
}

exports.updateSubject = async (id, data) => {
    return await knex('Subject')
        .where('subjectId', id)
        .update({
            subjectCode: data.subjectCode,
            subjectName: data.subjectName,
            description: data.description
        })
}

exports.deleteSubject = async (subjectId) => {
    return await knex('Subject').where('subjectId', subjectId).del()
}

