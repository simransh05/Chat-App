import React from 'react'
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
function SidebarHeader({ currentUser }) {
    const navigate = useNavigate();
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

    return (
        <div className="heading">
            <div className="profile-avatar">
                {getInitials(currentUser)}
            </div>
            <FiLogOut onClick={logout} className="logout-icon" />
        </div>
    )
}

export default SidebarHeader
