import React from 'react'
import { useSelector } from 'react-redux';
function UserList({ handleUserClick, selectedBtn, selectedUser }) {
    const contacts = useSelector((state) => state.contact.contact);
    const recentChats = useSelector((state) => state.recent.chat);
    return (
        <ul className="user-list">
            {selectedBtn === "recentChat" ? (
                <>
                    {recentChats.length > 0 ? (
                        recentChats.map((chat, index) => (
                            <li
                                key={index}
                                className={`user-item ${selectedUser.name === chat.name ? "active-user" : ""}`}
                                onClick={() => handleUserClick(chat.name, chat.email)}
                            >
                                <div className="user-info">
                                    <div className="user-name">{chat.name}</div>
                                    <div className="user-email">{chat.email}</div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <div className="no-chat">No records found</div>
                    )}
                </>
            ) : selectedBtn === "myContact" ? (
                <>
                    {contacts.length > 0 ? (
                        contacts.map((c, index) => (
                            <li
                                key={index}
                                className={`user-item ${selectedUser.name === c.name ? "active-user" : ""}`}
                                onClick={() => handleUserClick(c.name, c.email)}
                            >
                                <div className="user-info">
                                    <div className="user-name">{c.name}</div>
                                    <div className="user-email">{c.email}</div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <div className="no-chat">No records found</div>
                    )}


                </>
            ) : null}
        </ul>
    )
}

export default UserList
