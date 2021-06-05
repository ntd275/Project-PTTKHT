import axios from 'axios';
import packagejson from "../../package.json"

const baseUrl = packagejson.proxy.charAt(packagejson.proxy.length - 1) === "/" ? packagejson.proxy.slice(0, -1) : packagejson.proxy

const user = axios.create({ timeout: 30000 });
const guest = axios.create({ timeout: 30000 });

guest.defaults.withCredentials = true;

user.interceptors.request.use(function (config) {
    //console.log(config)
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
        return guest.post(`${baseUrl}/auth/login`, { username: username, password: password })
    },
    refreshToken: () => {
        return guest.post(`${baseUrl}/auth/refresh-token`)
    },
    checkAuth: () => {
        return user.get(`${baseUrl}/auth/check-auth`)
    },
    getAccountInfo: (id) => {
        return user.get(`${baseUrl}/account/id/${id}`)
    },
    checkPassword: (id, password) => {
        return user.post(`${baseUrl}/account/check-password/${id}`, {
            password: password,
        })
    },
    changePassword: (id, oldPassword, newPassword) => {
        return user.put(`${baseUrl}/account/change-password/${id}`, {
            old_password: oldPassword,
            new_password: newPassword
        })
    },
    sendOTP: (username) => {
        return user.post(`${baseUrl}/auth/send-otp`, {
            username: username
        })
    },
    checkOTP: (otpToken, otp) => {
        return user.post(`${baseUrl}/auth/check-otp`, {
            otpToken: otpToken,
            otp: otp
        })
    },
    forgetPassword: (accessToken, newPassword) => {
        return user.post(`${baseUrl}/auth/forget-password`, {
            accessToken: accessToken,
            newPassword: newPassword
        })
    },
    getSchoolYearList: (page, perpage) => {
        return user.get(`${baseUrl}/school-year/list?page=${page}&perpage=${perpage}`)
    },
    addSchoolYear: (data) => {
        return user.post(`${baseUrl}/school-year/`, {
            schoolYear: data.schoolYear,
            beginSemester1: data.startFirstSemester,
            endSemester1: data.finishFirstSemester,
            beginSemester2: data.startSecondSemester,
            endSemester2: data.finishSecondSemester,
            description: data.description
        })
    },
    editSchoolYear: (data) => {
        return user.put(`${baseUrl}/school-year/id/${data.schoolYearId}`, {
            schoolYear: data.schoolYear,
            beginSemester1: data.startFirstSemester,
            endSemester1: data.finishFirstSemester,
            beginSemester2: data.startSecondSemester,
            endSemester2: data.finishSecondSemester,
            description: data.description
        })
    },
    deleteSchoolYear: (id) => {
        return user.delete(`${baseUrl}/school-year/id/${id}`)
    },
    getClassList: (page, perpage) => {
        return user.get(`${baseUrl}/class/list?page=${page}&perpage=${perpage}`)
    },
    searchClassByName: (page, perpage, name) => {
        return user.get(`${baseUrl}/class/name/${name}?page=${page}&perpage=${perpage}`)
    },
    addClass: (data) => {
        return user.post(`${baseUrl}/class/`, {
            className: data.className,
            classCode: data.classCode,
            description: data.description,
            schoolYearId: 4,
        })
    },
    editClass: (data) => {
        return user.put(`${baseUrl}/class/id/${data.classId}`, {
            className: data.className,
            classCode: data.classCode,
            description: data.description,
            schoolYearId: 4,
        })
    },
    deleteClass: (id) => {
        return user.delete(`${baseUrl}/class/id/${id}`)
    },
    getSubjectList: (page, perpage) => {
        return user.get(`${baseUrl}/subject/list?page=${page}&perpage=${perpage}`)
    },
    searchSubjectByName: (page, perpage, name) => {
        return user.get(`${baseUrl}/subject/name/${name}?page=${page}&perpage=${perpage}`)
    },
    addSubject: (data) => {
        return user.post(`${baseUrl}/subject/`, {
            subjectName: data.subjectName,
            subjectCode: data.subjectCode,
            description: data.description,
        })
    },
    editSubject: (data) => {
        return user.put(`${baseUrl}/subject/id/${data.subjectId}`, {
            subjectName: data.subjectName,
            subjectCode: data.subjectCode,
            description: data.description,
        })
    },
    deleteSubject: (id) => {
        return user.delete(`${baseUrl}/subject/id/${id}`)
    },
    getSpecialistTeamList: (page, perpage) => {
        return user.get(`${baseUrl}/specialist-team/list?page=${page}&perpage=${perpage}`)
    },
    searchSpecialistTeamByName: (page, perpage, name) => {
        return user.get(`${baseUrl}/specialist-team/name/${name}?page=${page}&perpage=${perpage}`)
    },
    addSpecialistTeam: (data) => {
        return user.post(`${baseUrl}/specialist-team/`, {
            specialistName: data.specialistName,
            description: data.description
        })
    },
    editSpecialistTeam: (data) => {
        return user.put(`${baseUrl}/specialist-team/id/${data.specialistTeamId}`, {
            specialistName: data.specialistName,
            description: data.description
        })
    },
    deleteSpecialistTeam: (id) => {
        return user.delete(`${baseUrl}/specialist-team/id/${id}`)
    },
    getStudentList: (page, perpage) => {
        return user.get(`${baseUrl}/student/list?page=${page}&perpage=${perpage}`)
    },
    getStudent: (id) => {
        return user.get(`${baseUrl}/student/id/${id}`)
    },
    getStudentByCode: (code) => {
        return user.get(`${baseUrl}/student/code/${code}`)
    },
    searchStudentByName: (page, perpage, name) => {
        return user.get(`${baseUrl}/student/name/${name}?page=${page}&perpage=${perpage}`)
    },
    searchStudentByNameOrCode: (page, perpage, query) => {
        return user.get(`${baseUrl}/student/search?page=${page}&perpage=${perpage}&query=${query}`)
    },
    addStudent: (data) => {
        return user.post(`${baseUrl}/student/`, {
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
        return user.put(`${baseUrl}/student/id/${data.studentId}`, {
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
        return user.delete(`${baseUrl}/student/id/${id}`)
    },
    getTeacherList: (page, perpage) => {
        return user.get(`${baseUrl}/teacher/list?page=${page}&perpage=${perpage}`)
    },
    getTeacher: (id) => {
        return user.get(`${baseUrl}/teacher/id/${id}`)
    },
    getTeacherByCode: (code) => {
        return user.get(`${baseUrl}/teacher/code/${code}`)
    },
    searchTeacherByName: (page, perpage, name) => {
        return user.get(`${baseUrl}/teacher/name/${name}?page=${page}&perpage=${perpage}`)
    },
    searchTeacherByNameOrCode: (page, perpage, query) => {
        return user.get(`${baseUrl}/teacher/search?page=${page}&perpage=${perpage}&query=${query}`)
    },
    addTeacher: (data) => {
        return user.post(`${baseUrl}/teacher/`, {
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
        return user.put(`${baseUrl}/teacher/id/${data.teacherId}`, {
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
        return user.delete(`${baseUrl}/teacher/id/${id}`)
    },
    getTeachingAssignmentList: (page, perpage) => {
        return user.get(`${baseUrl}/teaching-assignment/list?page=${page}&perpage=${perpage}`)
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
        return user.post(`${baseUrl}/teaching-assignment/`, {
            schoolYearId: data.schoolYearId,
            teacherId: data.teacherId,
            classId: data.classId,
            subjectId: data.subjectId
        })
    },
    deleteTeachingAssignment: (id) => {
        return user.delete(`${baseUrl}/teaching-assignment/id/${id}`)
    },
    getHomeroomTeacherAssignmentList: (page, perpage) => {
        return user.get(`${baseUrl}/homeroom-teacher-assignment/list?page=${page}&perpage=${perpage}`)
    },
    searchHomeroomTeacherAssignment: (page, perpage, searchCondition) => {
        let url = `/homeroom-teacher-assignment/search?page=${page}&perpage=${perpage}`
        //console.log(searchCondition)
        if (searchCondition.schoolYearId) url += `&schoolYearId=${searchCondition.schoolYearId}`
        if (searchCondition.teacherId) url += `&teacherId=${searchCondition.teacherId}`
        if (searchCondition.classId) url += `&classId=${searchCondition.classId}`
        return user.get(url)
    },
    addHomeroomTeacherAssignment: (data) => {
        return user.post(`${baseUrl}/homeroom-teacher-assignment`, {
            schoolYearId: data.schoolYearId,
            teacherId: data.teacherId,
            classId: data.classId,
        })
    },
    editHomeroomTeacherAssignment: (data) => {
        return user.put(`${baseUrl}/homeroom-teacher-assignment/id/${data.homeroomTeacherAssignmentId}`, {
            schoolYearId: data.schoolYearId,
            teacherId: data.teacherId,
            classId: data.classId,
        })
    },
    deleteHomeroomTeacherAssignment: (id) => {
        return user.delete(`${baseUrl}/homeroom-teacher-assignment/id/${id}`)
    },
    getSpecialistAssignmentList: (page, perpage) => {
        return user.get(`${baseUrl}/specialist-assignment/list?page=${page}&perpage=${perpage}`)
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
        return user.post(`${baseUrl}/specialist-assignment`, {
            schoolYearId: data.schoolYearId,
            teacherId: data.teacherId,
            specialistTeamId: data.specialistTeamId
        })
    },
    deleteSpecialistAssignment: (id) => {
        return user.delete(`${baseUrl}/specialist-assignment/id/${id}`)
    },
    getStudentAssignmentList: (page, perpage) => {
        return user.get(`${baseUrl}/student-assignment/list?page=${page}&perpage=${perpage}`)
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
        return user.post(`${baseUrl}/student-assignment`, {
            schoolYearId: data.schoolYearId,
            studentId: data.studentId,
            classId: data.classId
        })
    },
    deleteStudentAssignment: (id) => {
        return user.delete(`${baseUrl}/student-assignment/id/${id}`)
    },
    tranferClass: (list) => {
        return user.post(`${baseUrl}/student-assignment/transform-class`, {
            data: list
        })
    },
    getAccountList: (page, perpage) => {
        return user.get(`${baseUrl}/account/list?page=${page}&perpage=${perpage}`)
    },
    addAccount: (data) => {
        return user.post(`${baseUrl}/account/`, {
            accountName: data.accountName,
            password: data.password,
            userCode: data.userCode,
            role: data.role
        })
    },
    editAccount: (data) => {
        return user.put(`${baseUrl}/account/${data.accountId}`, {
            accountName: data.accountName,
            password: data.password,
            userCode: data.userCode,
            role: parseInt(data.role)
        })
    },
    deleteAccount: (id) => {
        return user.delete(`${baseUrl}/account/${id}`)
    },
    getScoreLockList: (page, perpage) => {
        return user.get(`${baseUrl}/score-lock/list?page=${page}&perpage=${perpage}`)
    },
    addScoreLock: (data) => {
        return user.post(`${baseUrl}/score-lock/`, {
            schoolYearId: data.schoolYearId,
            term: data.term,
            lock: data.lock
        })
    },
    lockScoreLock: (data) => {
        return user.put(`${baseUrl}/score-lock/lock/`, {
            schoolYearId: data.schoolYearId,
            term: data.term,
        })
    },
    unlockScoreLock: (data) => {
        return user.put(`${baseUrl}/score-lock/unlock/`, {
            schoolYearId: data.schoolYearId,
            term: data.term,
        })
    },
    deleteScoreLock: (id) => {
        return user.delete(`${baseUrl}/score-lock/id/${id}`)
    },
    checkLock: (schoolYearId, term) => {
        return user.get(`${baseUrl}/score/check-lock?schoolYearId=${schoolYearId}&term=${term}`)
    },
    getSubjectScore: (studentId, subjectId, schoolYearId, term) => {
        return user.get(`${baseUrl}/score/student/subject-scores?studentId=${studentId}&subjectId=${subjectId}&schoolYearId=${schoolYearId}&term=${term}`)
    },
    getStudentScore: (studentId, schoolYearId, term) => {
        return user.get(`${baseUrl}/score/student/scores?studentId=${studentId}&schoolYearId=${schoolYearId}&term=${term}`)
    },
    editScore: (data) => {
        return user.put(`${baseUrl}/score/`, data)
    },
    getClassConduct: (searchCondition) => {
        return user.get(`${baseUrl}/conduct/class?teacherId=${searchCondition.teacherId}&schoolYearId=${searchCondition.schoolYearId}&term=${searchCondition.term}`)
    },
    getStudentConduct: (searchCondition) => {
        return user.get(`${baseUrl}/conduct/student?studentId=${searchCondition.studentId}&schoolYearId=${searchCondition.schoolYearId}&term=${searchCondition.term}`)
    },
    assessConduct: (data) => {
        return user.post(`${baseUrl}/conduct`, {
            studentId: data.studentId,
            classId: data.classId,
            teacherId: data.teacherId,
            schoolYearId: data.schoolYearId,
            conduct: data.conduct,
            term: data.term,
            note: data.note
        })
    },
    getRankReport: (page, perpage, searchCondition) => {
        return user.get(`${baseUrl}/class-report/rank?page=${page}&perpage=${perpage}&schoolYearId=${searchCondition.schoolYearId}&classId=${searchCondition.classId}&term=${searchCondition.term}`)
    },
    getSubjectReport: (page, perpage, searchCondition) => {
        return user.get(`${baseUrl}/class-report/subject?page=${page}&perpage=${perpage}&schoolYearId=${searchCondition.schoolYearId}&classId=${searchCondition.classId}&term=${searchCondition.term}`)
    },
    getStudentScoreSummary: (searchCondition) => {
        return user.get(`${baseUrl}/score/student/score-summary?studentId=${searchCondition.studentId}&schoolYearId=${searchCondition.schoolYearId}`)
    },
    getHomeroomClassInfo: (teacherId) => {
        return user.get(`${baseUrl}/class/homeroom?key=${teacherId}`)
    },
    getClassAttendance: (searchCondition) => {
        let getDateString = (date) => {
            let d = new Date(date)
            let dd = d.getDate()
            let mm = d.getMonth() + 1
            let yyyy = d.getFullYear()
            if (dd < 10) { dd = '0' + dd }
            if (mm < 10) { mm = '0' + mm }
            return yyyy + "-" + mm + "-" + dd
        }
        return user.get(`${baseUrl}/attendance/class/between?classId=${searchCondition.classId}&schoolYearId=${searchCondition.schoolYearId}&&firstDate=${getDateString(searchCondition.beginDate)}&lastDate=${getDateString(searchCondition.endDate)}`)
    },
    updateAttendance: (data) => {
        return user.put(`${baseUrl}/attendance`, data)
    },
    getPLL: (searchCondition) => {

        return user.get(`${baseUrl}/pll?studentId=${searchCondition.studentId}&schoolYearId=${searchCondition.schoolYearId}`)
    },
    uploadImage: (image) => {
        let data = new FormData();
        data.append("avatar", image)
        return user.post(`${baseUrl}/account/upload-image/`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }
}

export default Api