import axios from "axios";
const base_url = import.meta.env.VITE_BASE_URL;

const api = {
    createUser: async (formData) => {
        return await axios.post(`${base_url}/signup`, formData);
    },
    createUserInfo: async (formData) => {
        return await axios.post(`${base_url}/login`, formData);
    },
    contract: async (id) => {
        return await axios.get(`${base_url}/contact/${id}`);
    },
    recent: async (id) => {
        return await axios.get(`${base_url}/recent/${id}`);
    },
    userFetch: async (currentUser) => {
        return await axios.get(`${base_url}/users?name=${currentUser}`)
    }
}

export default api;