import apiInstance from "./apiInstance";

const api = {
    createUser: async (formData) => {
        return await apiInstance.post(`/signup`, formData);
    },
    createUserInfo: async (formData) => {
        return await apiInstance.post(`/login`, formData);
    },
    currentUserFetch: async () => {
        return await apiInstance.get(`/currentUser`);
    },
    contract: async (id) => {
        return await apiInstance.get(`/contact/${id}`);
    },
    recent: async (id) => {
        return await apiInstance.get(`/recent/${id}`);
    },
    userFetch: async (currentUser) => {
        return await apiInstance.get(`/users?name=${currentUser}`)
    },
    getHistory: async (currentUser, selectedUser) => {
        return await apiInstance.get(
            `/history?user1=${currentUser}&user2=${selectedUser}`
        );
    },
    postInvite: async (sendData) => {
        return await apiInstance.post(`/invite`, sendData);
    },
    postContact: async (allData) => {
        return await apiInstance.post(`/contact`, allData);
    },
    uploadProfile: async (formData) => {
        return await apiInstance.post(`/upload`, formData);
    },
    updateName: async (data) => {
        return await apiInstance.put(`/update-name`, data);
    },
    deleteChat: async (currentUser, selectedUser) => {
        await apiInstance.delete(`/delete/${currentUser}/${selectedUser}`);
    },
    resetPassword: async (payload) => {
        return await apiInstance.put(`/reset-password`, payload);
    },
    logout: async () => {
        return await apiInstance.post('/logout')
    }
}

export default api;