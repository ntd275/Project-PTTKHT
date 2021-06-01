import axios from 'axios';

const user = axios.create({ timeout: 10000 });
const guest = axios.create({ timeout: 10000 });

guest.defaults.withCredentials = true;

user.interceptors.request.use(function (config) {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        config.headers["x-access-token"] = accessToken;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

user.interceptors.response.use(function (response) {
    return response;
}, async function (error) {
    const originalRequest = error.config;
    //console.log(error.response)
    if (!originalRequest.retry && error.response && error.response.status === 401) {
        try {
            originalRequest.retry = true;
            let res = await Api.refreshToken()
            localStorage.setItem("accessToken", res.data.accessToken)
            console.log("Access token refreshed")
            return user(originalRequest)
        } catch (err) {
            return Promise.reject(error);
        }
    }
    return Promise.reject(error);
});

const Api = {
    login: (username, password) => {
        return guest.post('/auth/login', { username: username, password: password })
    },
    refreshToken: () => {
        return guest.post('/auth/refresh-token')
    },
    checkAuth: () => {
        return user.get('/auth/check-auth')
    },
    getAccountInfo: (id) => {
        return user.get(`/account/id/${id}`)
    },
    checkPassword: (id, password) => {
        return user.post(`/account/check-password/${id}`, {
            password: password,
        })
    },
    changePassword: (id, oldPassword, newPassword) => {
        return user.put(`/account/change-password/${id}`, {
            old_password: oldPassword,
            new_password: newPassword
        })
    },
    sendOTP: (username) => {
        return user.post('/auth/send-otp', {
            username: username
        })
    },
    getSchoolYearList: (page, perpage) => {
        return user.get(`/school-year/list?page=${page}&perpage=${perpage}`)
    },
    addSchoolYear: (data) => {
        return user.post(`/school-year/`, {
            schoolYear: data.schoolYear,
            beginSemester1: data.startFirstSemester,
            endSemester1: data.finishFirstSemester,
            beginSemester2: data.startSecondSemester,
            endSemester2: data.finishSecondSemester,
            description: data.description
        })
    },
    editSchoolYear: (data) => {
        return user.put(`/school-year/id/${data.schoolYearId}`, {
            schoolYear: data.schoolYear,
            beginSemester1: data.startFirstSemester,
            endSemester1: data.finishFirstSemester,
            beginSemester2: data.startSecondSemester,
            endSemester2: data.finishSecondSemester,
            description: data.description
        })
    },
    deleteSchoolYear: (id) => {
        return user.delete(`/school-year/id/${id}`)
    },
    getClassList: (page, perpage) => {
        return user.get(`/class/list?page=${page}&perpage=${perpage}`)
    },
    addClass: (data) => {
        return user.post(`/class/`, {
            className: data.className,
            classCode: data.classCode,
            description: data.description,
            schoolYearId: 4,
        })
    },
    editClass: (data) => {
        return user.put(`/class/id/${data.classId}`, {
            className: data.className,
            classCode: data.classCode,
            description: data.description,
            schoolYearId: 4,
        })
    },
    deleteClass: (id) => {
        return user.delete(`/class/id/${id}`)
    },
    getSubjectList: (page, perpage) => {
        return user.get(`/subject/list?page=${page}&perpage=${perpage}`)
    },
    addSubject: (data) => {
        return user.post(`/subject/`, {
            subjectName: data.subjectName,
            subjectCode: data.subjectCode,
            description: data.description,
        })
    },
    editSubject: (data) => {
        return user.put(`/subject/id/${data.subjectId}`, {
            subjectName: data.subjectName,
            subjectCode: data.subjectCode,
            description: data.description,
        })
    },
    deleteSubject: (id) => {
        return user.delete(`/subject/id/${id}`)
    },
    getSpecialistTeamList: (page, perpage) => {
        return user.get(`/specialist-team/list?page=${page}&perpage=${perpage}`)
    },
    addSpecialistTeam: (data) => {
        return user.post(`/specialist-team/`, {
            specialistName: data.specialistName,
            description: data.description
        })
    },
    editSpecialistTeam: (data) => {
        return user.put(`/specialist-team/id/${data.specialistTeamId}`, {
            specialistName: data.specialistName,
            description: data.description
        })
    },
    deleteSpecialistTeam: (id) => {
        return user.delete(`/specialist-team/id/${id}`)
    },
    getStudentList: (page, perpage) => {
        return user.get(`/student/list?page=${page}&perpage=${perpage}`)
    },
    getStudentByCode: (code) => {
        return user.get(`/student/code/${code}`)
    },
    addStudent: (data) => {
        return user.post(`/student/`, {
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
            dateOfParty: data.dateOfParty,
            dateOfUnion: data.dateOfUnion,
            accountName: data.accountName,
            fatherName: data.fatherName,
            fatherPhone: data.fatherPhone,
            fatherMail: data.fatherMail,
            motherName: data.motherName,
            motherPhone: data.motherPhone,
            motherMail: data.motherMail
        })
    },
    editStudent: (data) => {
        return user.put(`/student/id/${data.studentId}`, {
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
            dateOfParty: data.dateOfParty,
            dateOfUnion: data.dateOfUnion,
            accountName: data.accountName,
            fatherName: data.fatherName,
            fatherPhone: data.fatherPhone,
            fatherMail: data.fatherMail,
            motherName: data.motherName,
            motherPhone: data.motherPhone,
            motherMail: data.motherMail
        })
    },
    deleteStudent: (id) => {
        return user.delete(`/student/id/${id}`)
    },
    getTeacherList: (page, perpage) => {
        return user.get(`/teacher/list?page=${page}&perpage=${perpage}`)
    },
    getTeacherByCode: (code) => {
        return user.get(`/teacher/code/${code}`)
    },
    addTeacher: (data) => {
        return user.post(`/teacher/`, {
            teacherCode: data.teacherCode,
            teacherName: data.teacherName,
            address: data.address,
            permanentResidence: data.permanentResidence,
            gender: data.gender,
            pId: data.pId,
            image: data.image,
            dateOfBirth: data.dateOfBirth,
            email: data.email,
            phoneNumber: data.phoneNumber,
            dateOfParty: data.dateOfParty,
            dateOfUnion: data.dateOfUnion,
            civilServantNumber: data.civilServantNumber,
            major: data.major
        })
    },
    editTeacher: (data) => {
        return user.put(`/teacher/id/${data.teacherId}`, {
            teacherCode: data.teacherCode,
            teacherName: data.teacherName,
            address: data.address,
            permanentResidence: data.permanentResidence,
            gender: data.gender,
            pId: data.pId,
            image: data.image,
            dateOfBirth: data.dateOfBirth,
            email: data.email,
            phoneNumber: data.phoneNumber,
            dateOfParty: data.dateOfParty,
            dateOfUnion: data.dateOfUnion,
            civilServantNumber: data.civilServantNumber,
            major: data.major
        })
    },
    deleteTeacher: (id) => {
        return user.delete(`/teacher/id/${id}`)
    },
    getTeachingAssignmentList: (page, perpage) => {
        return user.get(`/teaching-assignment/list?page=${page}&perpage=${perpage}`)
    },
    searchTeachingAssignment: (page, perpage, searchCondition) => {
        let url = `/teaching-assignment/search?page=${page}&perpage=${perpage}`
        //console.log(searchCondition)
        if (searchCondition.schoolYearId) url += `&schoolYearId=${searchCondition.schoolYearId}`
        if (searchCondition.teacherId) url += `&teacherId=${searchCondition.teacherId}`
        if (searchCondition.classId) url += `&classId=${searchCondition.classId}`
        if (searchCondition.subjectId) url += `&subjectId=${searchCondition.subjectId}`
        return user.get(url)
    },
    addTeachingAssignment: (data) => {
        return user.post(`/teaching-assignment/`, {
            schoolYearId: data.schoolYearId,
            teacherId: data.teacherId,
            classId: data.classId,
            subjectId: data.subjectId
        })
    },
    deleteTeachingAssignment: (id) => {
        return user.delete(`/teaching-assignment/id/${id}`)
    },
    getHomeroomTeacherAssignmentList: (page, perpage) => {
        return user.get(`/homeroom-teacher-assignment/list?page=${page}&perpage=${perpage}`)
    },
    searchHomeroomTeacherAssignment: (page, perpage, searchCondition) => {
        let url = `/homeroom-teacher-assignment/search?page=${page}&perpage=${perpage}`
        console.log(searchCondition)
        if (searchCondition.schoolYearId) url += `&schoolYearId=${searchCondition.schoolYearId}`
        if (searchCondition.teacherId) url += `&teacherId=${searchCondition.teacherId}`
        if (searchCondition.classId) url += `&classId=${searchCondition.classId}`
        return user.get(url)
    },
    addHomeroomTeacherAssignment: (data) => {
        return user.post(`/homeroom-teacher-assignment`, {
            schoolYearId: data.schoolYearId,
            teacherId: data.teacherId,
            classId: data.classId,
        })
    },
    editHomeroomTeacherAssignment: (data) => {
        return user.put(`/homeroom-teacher-assignment/id/${data.homeroomTeacherAssignmentId}`, {
            schoolYearId: data.schoolYearId,
            teacherId: data.teacherId,
            classId: data.classId,
        })
    },
    deleteHomeroomTeacherAssignment: (id) => {
        return user.delete(`/homeroom-teacher-assignment/id/${id}`)
    },
    getSpecialistAssignmentList: (page, perpage) => {
        return user.get(`/specialist-assignment/list?page=${page}&perpage=${perpage}`)
    },
    searchSpecialistAssignment: (page, perpage, searchCondition) => {
        let url = `/specialist-assignment/search?page=${page}&perpage=${perpage}`
        console.log(searchCondition)
        if (searchCondition.schoolYearId) url += `&schoolYearId=${searchCondition.schoolYearId}`
        if (searchCondition.teacherId) url += `&teacherId=${searchCondition.teacherId}`
        if (searchCondition.specialistTeamId) url += `&specialistTeamId=${searchCondition.specialistTeamId}`
        return user.get(url)
    },
    addSpecialistAssignment: (data) => {
        return user.post(`/specialist-assignment`, {
            schoolYearId: data.schoolYearId,
            teacherId: data.teacherId,
            specialistTeamId: data.specialistTeamId
        })
    },
    deleteSpecialistAssignment: (id) => {
        return user.delete(`/specialist-assignment/id/${id}`)
    },
    getStudentAssignmentList: (page, perpage) => {
        return user.get(`/student-assignment/list?page=${page}&perpage=${perpage}`)
    },
    searchStudentAssignment: (page, perpage, searchCondition) => {
        let url = `/student-assignment/search?page=${page}&perpage=${perpage}`
        console.log(searchCondition)
        if (searchCondition.schoolYearId) url += `&schoolYearId=${searchCondition.schoolYearId}`
        if (searchCondition.studentId) url += `&studentId=${searchCondition.studentId}`
        if (searchCondition.classId) url += `&classId=${searchCondition.classId}`
        return user.get(url)
    },
    addStudentAssignment: (data) => {
        return user.post(`/student-assignment`, {
            schoolYearId: data.schoolYearId,
            studentId: data.studentId,
            classId: data.classId
        })
    },
    deleteStudentAssignment: (id) => {
        return user.delete(`/student-assignment/id/${id}`)
    },
    tranferClass: (list) => {
        return user.post(`/student-assignment/transform-class`, {
            data: list
        })
    },
    getAccountList: (page, perpage) => {
        return user.get(`/account/list?page=${page}&perpage=${perpage}`)
    },
    addAccount: (data) => {
        return user.post(`/account/`, {
            accountName: data.accountName,
            password: data.password,
            userCode: data.userCode,
            role: data.role
        })
    },
    editAccount: (data) => {
        return user.put(`/account/${data.accountId}`, {
            accountName: data.accountName,
            password: data.password,
            userCode: data.userCode,
            role: parseInt(data.role)
        })
    },
    deleteAccount: (id) => {
        return user.delete(`/account/${id}`)
    },
    getScoreLockList: (page, perpage) => {
        return user.get(`/score-lock/list?page=${page}&perpage=${perpage}`)
    },
    addScoreLock: (data) => {
        return user.post(`/score-lock/`, {
            schoolYearId: data.schoolYearId,
            term: data.term,
            lock: data.lock
        })
    },
    lockScoreLock: (data) => {
        return user.put(`/score-lock/lock/`, {
            schoolYearId: data.schoolYearId,
            term: data.term,
        })
    },
    unlockScoreLock: (data) => {
        return user.put(`/score-lock/unlock/`, {
            schoolYearId: data.schoolYearId,
            term: data.term,
        })
    },
    deleteScoreLock: (id) => {
        return user.delete(`/score-lock/id/${id}`)
    },
    checkLock: (schoolYearId, term) => {
        return user.get(`/score/check-lock?schoolYearId=${schoolYearId}&term=${term}`)
    },
    getSubjectScore: (studentId, subjectId, schoolYearId, term) => {
        return user.get(`/score/student/subject-scores?studentId=${studentId}&subjectId=${subjectId}&schoolYearId=${schoolYearId}&term=${term}`)
    },
    getStudentScore: (studentId, schoolYearId, term) => {
        return user.get(`/score/student/scores?studentId=${studentId}&schoolYearId=${schoolYearId}&term=${term}`)
    },
    editScore: (data) => {
        return user.put(`/score/`, data)
    }
}

export default Api