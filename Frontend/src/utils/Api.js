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
    },
    getHistory: async (currentUser, selectedUser) => {
        return await axios.get(
            `${base_url}/history?user1=${currentUser}&user2=${selectedUser}`
        );
    },
    postInvite: async (sendData) => {
        return await axios.post(`${base_url}/invite`, sendData);
    },
    postContact: async (allData) => {
        return await axios.post(`${base_url}/contact`, allData);
    },
    uploadProfile: async (formData) => {
        return await axios.post(`${base_url}/upload`, formData);
    },
    updateName :async (data) => {
        return await axios.put(`${base_url}/update-name`, data);
    },
    deleteChat :async (currentUser, selectedUser) => {
        await axios.delete(`${base_url}/delete/${currentUser}/${selectedUser}`);
    }
}

export default api;