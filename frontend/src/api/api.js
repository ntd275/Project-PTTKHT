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
    //console.log(error)
    if (!originalRequest.retry || error.status !== 401) {
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
        return user.post('/auth/check-auth')
    },
    getSchoolYearList: (page, perpage) => {
        return user.get(`/school-year/list?page=${page},perpage=${perpage}`)
    }
}

export default Api