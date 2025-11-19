import React, { useState } from 'react'
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import AddProfilePic from '../ProfileModal/AddProfilePic';
const base_url = import.meta.env.VITE_BASE_URL;
function SidebarHeader({ currentUser }) {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const getInitials = (name) => {
        if (!name) return "";
        const parts = name.trim().split(" ");
        if (parts.length === 1) {
            return parts[0].slice(0, 2).toUpperCase();
        }
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const logout = () => {
        Swal.fire({
            title: "Logout?",
            text: "Are you sure you want to logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                navigate('/');
            }
        });
    };

    const upload = (newPic) => {
        const info = JSON.parse(localStorage.getItem("login-info"));

        // update user profile pic
        info.user.ProfilePic = newPic;
        console.log(info.user.ProfilePic)

        // save back to localStorage
        localStorage.setItem("login-info", JSON.stringify(info));
        console.log(localStorage.getItem('login-info'))
        // update UI in parent
        currentUser.ProfilePic = newPic;
        console.log(currentUser.ProfilePic)
    };

    return (
        <div className="heading">
            <button className="profile-avatar" onClick={() => setShowModal(true)}>
                {
                currentUser.ProfilePic ? (
                    <img
                        src={`${base_url}${currentUser.ProfilePic}`}
                        alt="profile"
                        className="avatar-img"
                    />
                ) : (
                    getInitials(currentUser.name)
                )}
            </button>
            {showModal && (
                <AddProfilePic
                    open={showModal}
                    currentUser={currentUser}
                    close={() => setShowModal(false)}
                    onUpload={(pic)=>upload(pic)}
                />
            )}
            <FiLogOut onClick={logout} className="logout-icon" />
        </div>
    )
}

export default SidebarHeader
