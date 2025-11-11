import React, { useState } from 'react';
const base_url = import.meta.env.VITE_BASE_URL;
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function AddContact() {
    const [data, setData] = useState({ name: '', email: '' });

    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const save = async (e) => {
        e.preventDefault();
        const login = JSON.parse(localStorage.getItem('login-info'));
        const id = login.user.id;
        const allData = { name: data.name, email: data.email, id };
        console.log(allData)
        const submitData = await axios.post(`${base_url}/contact`, allData);
        navigate(`/chat/${id}`)
    };

    return (

        <div className="auth-container">
            <h2>Add Contact</h2>
            <form onSubmit={save}>
                <input name="name" type="text" placeholder="Name" onChange={handleChange} required />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                <button type="submit">Add Contact</button>
            </form>

        </div>
    );
}

export default AddContact;
