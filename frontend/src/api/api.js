import axios from 'axios';

const Api = {
    login: (username, password) => {
        return axios.post('/auth/login', { username: username, password: password })
    },
    refreshToken: () => {
        return axios.post('/auth/refresh-token')
    },
    checkAuth: () => {
        return axios.post('/auth/check-auth')
    }
}

export default Api