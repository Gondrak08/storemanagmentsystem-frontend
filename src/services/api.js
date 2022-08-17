import axios from 'axios';

const api = axios.create({
    baseURL: "https://storemanagmentsystem.herokuapp.com"
})

export default api;

