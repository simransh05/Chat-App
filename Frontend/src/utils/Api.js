import axios from "axios";
const base_url = import.meta.env.VITE_BASE_URL;

const api = {
    createUser : async (formData)=>{
        return await axios.post(`${base_url}/signup`, formData);
    },
    createUserInfo : async (formData)=>{
       return await axios.post(`${base_url}/login`, formData);
    }
}

export default api;