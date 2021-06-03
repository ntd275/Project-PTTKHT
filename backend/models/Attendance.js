
const knex = require('./database')

exports.getAttendanceList = async (page, perpage) => {
    return knex.select().table('Attendance').paginate({ perPage: perpage, currentPage: page, isLengthAware: true })
}

exports.getAttendanceById = async (attendanceId) => {
    return knex('Attendance').where('attendanceId', attendanceId).first()
}

exports.getStudentAttendance = async (studentId, schoolYearId, term) => {
    return knex('Attendance').where({
        studentId: studentId,
        schoolYearId: schoolYearId,
        term: term
    })
}

exports.getClassAttendance = async (classId, schoolYearId, term, t1, t2) => {
    return knex('Attendance').where({
        classId: classId,
        schoolYearId: schoolYearId,
        term: term
    }).whereBetween('date', t1, t2)
}

/** Attendance type
 * Chỉ lưu những ngày mà học sinh bị đánh vắng
 * 0: vắng, có phép
 * 1: vắng, không phép
 */
exports.updateAttendance = async (data) => {
    let count = 0
    let students = data.students
    await knex.transaction(async trx => {
        try {
            for (let i = 0; i < students.length; i++) {
                const student = students[i];

                //Check exists student
                let existStudent = await trx.where('studentId', student.studentId).from('Student').first()
                if (existStudent === undefined || !existStudent) {
                    let message = `studentId = ${student.studentId} not found`
                    return Promise.reject(message)
                }

                let attendances = student.attendances

                for (let j = 0; j < attendances.length; j++) {
                    let term = attendances[j].term
                    let attendance = attendances[j].attendance

                    if (term < 0 || term > 2 || attendance < 0 || attendance > 1) {
                        let message = `Error with attendance/term of studentId = ${student.studentId}`
                        return Promise.reject(message)
                    }

                    attendances[j].date = await new Date(attendances[j].date).toISOString().slice(0, 10).replace('T', ' ')
                    let attExist = null

                    switch (attendances[j].method) {
                        case "add":
                            //Check exists
                            attExist = await trx.from('Attendance').where({
                                'studentId': student.studentId,
                                'schoolYearId': attendances[j].schoolYearId,
                                'classId': student.classId,
                                'kind': kind,
                                'term': term,
                                'date': attendances[j].date
                            }).count('attendanceId as cnt')
                            if (attExist[0].cnt > 0) {
                                let message = `Cannot add more than one attendance at date = ${attendances[j].date}`
                                return Promise.reject(message)
                            }

                            await trx.insert({
                                'studentId': student.studentId,
                                'classId': student.classId,
                                'teacherId': attendances[j].teacherId,
                                'schoolYearId': attendances[j].schoolYearId,
                                'date': attendances[j].date,
                                'attendance': attendances[j].attendance,
                                'term': attendances[j].term
                            })
                            break;

                        case "edit":
                            attExist = await trx.where('attendanceId', attendances[j].attendanceId).select().from('Attendance').first()

                            if (attExist === undefined || !attExist) {
                                let message = `attendanceId = ${attendances[j].attendanceId} not found`
                                return Promise.reject(message)
                            }

                            await trx.where('attendanceId', attendances[j].attendanceId).from('Attendance').update({
                                'attendance': attendances[j].attendance
                            })

                            break;

                        case "delete":
                            attExist = await trx.where('attendanceId', attendances[j].attendanceId).select().from('Attendance').first()

                            if (attExist === undefined || !attExist) {
                                let message = `attendanceId = ${attendances[j].attendanceId} not found`
                                return Promise.reject(message)
                            }

                            await trx.where('attendanceId', attendances[j].attendanceId).from('Attendance').delete()
                            break

                        default:
                            let message = `Method not found`
                            return Promise.reject(message)
                    }
                    count++
                }
            }
        } catch (error) { //Rollback
            console.log(error)
            return Promise.reject(error)
        }
    })

    return count
}
