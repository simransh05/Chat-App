import React from 'react'
import { useState } from "react";
import { useSelector } from "react-redux";
const base_url = import.meta.env.VITE_BASE_URL;
function ChatHeader({ selectedUser, setFontSize, getInitials }) {
    const [showMenu, setShowMenu] = useState(false);
    const contacts = useSelector((state) => state.contact.contact);
    const recentChats = useSelector((state) => state.recent.chat);
    const users = useSelector((state) => state.user.users);

    const fullUser = selectedUser
        ? users.find((u) => u.email === selectedUser.email)
        : null;
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
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatHeader
