import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import AddProfilePic from '../ProfileModal/AddProfilePic';
import {
    Menu, MenuItem, IconButton,
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ResetPasswordModal from '../ProfileModal/ResetPasswordModal';
import api from '../../utils/Api';
import { useSelector } from 'react-redux';

const base_url = import.meta.env.VITE_BASE_URL;

function SidebarHeader({ getInitials }) {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const [openPassModal, setOpenPassModal] = useState(false);
    const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const currentUser = useSelector(state => state.currentUser.users);

    const logout = async () => {
        const result = await Swal.fire({
            title: "Logout?",
            text: "Are you sure you want to logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                await api.logout(); 
                navigate('/');
            } catch (err) {
                console.error("Logout failed:", err);
            }
        }
    };


    return (
        <div className="heading">
            <button className="profile-avatar" onClick={() => setShowModal(true)}>
                {currentUser?.ProfilePic ? (
                    <img
                        src={`${base_url}${currentUser.ProfilePic}`}
                        alt="profile"
                        className="avatar-img"
                    />
                ) : (
                    getInitials(currentUser?.name)
                )}
            </button>

            {showModal && (
                <AddProfilePic
                    open={showModal}
                    currentUser={currentUser}
                    close={() => setShowModal(false)}
                />
            )}

            <div className='username'>{currentUser?.name}</div>

            <IconButton onClick={handleMenuClick} sx={{
                display: "flex", justifyContent: 'right', alignItems: "flex-end", padding: 0,       // remove extra padding
                minWidth: 'auto', maxWidth: '30px'
            }}>
                <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
                <MenuItem onClick={() => { setOpenPassModal(true); handleMenuClose(); }}>
                    Reset Password
                </MenuItem>

                <MenuItem onClick={() => { logout(); handleMenuClose(); }}>
                    Logout
                </MenuItem>
            </Menu>
            <ResetPasswordModal
                open={openPassModal}
                onClose={() => setOpenPassModal(false)}
                currentUser={currentUser}
            />
        </div>
    );
}

export default SidebarHeader;