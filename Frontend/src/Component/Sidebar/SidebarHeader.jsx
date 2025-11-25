import React, { useState } from 'react'
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import AddProfilePic from '../ProfileModal/AddProfilePic';
const base_url = import.meta.env.VITE_BASE_URL;
function SidebarHeader({ currentUser, getInitials, setCurrentUser }) {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

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
        info.user.ProfilePic = newPic;
        console.log(info.user.ProfilePic)
        localStorage.setItem("login-info", JSON.stringify(info));
        console.log(localStorage.getItem('login-info'))
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
                    setCurrentUser={setCurrentUser}
                    close={() => setShowModal(false)}
                    onUpload={(pic) => upload(pic)}
                />
            )}
            <div className='username'>
                {currentUser.name}
            </div>
            <FiLogOut onClick={logout} className="logout-icon" />
        </div>
    )
}

export default SidebarHeader
