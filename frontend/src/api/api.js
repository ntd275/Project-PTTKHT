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
    }
}

export default Api