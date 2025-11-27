import React, { useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import api from "../../utils/Api";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const base_url = import.meta.env.VITE_BASE_URL;

function ChatHeader({ selectedUser, setFontSize, getInitials, currentUser, setMessages, setSelectedUser }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const users = useSelector((state) => state.user.users);

    const fullUser = selectedUser
        ? users.find((u) => u.email === selectedUser.email)
        : null;

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteChat = async () => {
        handleMenuClose();

        const confirm = await Swal.fire({
            title: "Delete Chat?",
            text: `Are you sure you want to delete your chat with ${selectedUser?.name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
            reverseButtons: true,
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await api.deleteChat(currentUser.id, selectedUser.id);

            Swal.fire({
                icon: "success",
                title: "Chat Deleted",
                timer: 1200,
                showConfirmButton: false,
            });

            setMessages([]);
            setSelectedUser(null);

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to delete chat!",
            });
        }
    };

    return (
        <div className="chat-header">
            {fullUser && (
                <>
                    {fullUser.ProfilePic ? (
                        <img
                            src={`${base_url}${fullUser.ProfilePic}`}
                            alt="profile"
                            className="header-avatar"
                        />
                    ) : (
                        <div className="header-avatar-initial">
                            {getInitials(fullUser.name)}
                        </div>
                    )}
                    <div className="name">{selectedUser.name}</div>
                </>
            )}

            <IconButton onClick={handleMenuOpen}
                size="small" sx={{
                    display: "flex", justifyContent: 'right', alignItems: "flex-end", padding: 0,       // remove extra padding
                    minWidth: 'auto',maxWidth:'30px'
                }}>
                <MoreVertIcon />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <MenuItem onClick={() => { setFontSize("small"); handleMenuClose(); }}>
                    Small
                </MenuItem>
                <MenuItem onClick={() => { setFontSize("normal"); handleMenuClose(); }}>
                    Normal
                </MenuItem>
                <MenuItem onClick={() => { setFontSize("large"); handleMenuClose(); }}>
                    Large
                </MenuItem>

                <MenuItem
                    onClick={handleDeleteChat}
                    sx={{ color: "red", fontWeight: "bold" }}
                >
                    Delete Chat
                </MenuItem>
            </Menu>
        </div>
    );
}

export default ChatHeader;