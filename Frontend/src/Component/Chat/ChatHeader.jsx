import React, { useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import api from "../../utils/Api";

const base_url = import.meta.env.VITE_BASE_URL;

function ChatHeader({ selectedUser, setFontSize, getInitials, currentUser, setMessages, onChatDeleted }) {
    const [showMenu, setShowMenu] = useState(false);

    const users = useSelector((state) => state.user.users);

    const fullUser = selectedUser
        ? users.find((u) => u.email === selectedUser.email)
        : null;

    const handleDeleteChat = async () => {
        setShowMenu(false);

        const confirm = await Swal.fire({
            title: "Delete Chat?",
            text: `Are you sure you want to delete your chat with ${selectedUser?.name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await api.deleteChat(currentUser.id , selectedUser.id)
            console.log(res.status)

            Swal.fire({
                icon: "success",
                title: "Chat Deleted",
                timer: 1200,
                showConfirmButton: false,
            });

            setMessages([]);         
            onChatDeleted();         

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

            <div className="menu">
                <button onClick={() => setShowMenu(!showMenu)}>⋮</button>

                {showMenu && (
                    <div className="menu-options">
                        <button onClick={() => setFontSize("small")}>Small</button>
                        <button onClick={() => setFontSize("normal")}>Normal</button>
                        <button onClick={() => setFontSize("large")}>Large</button>

                        <button
                            style={{ color: "red", marginTop: "6px" }}
                            onClick={handleDeleteChat}
                        >
                            Delete Chat
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatHeader;
