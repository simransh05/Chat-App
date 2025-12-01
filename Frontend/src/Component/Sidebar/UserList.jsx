import { useSelector } from "react-redux";
import { Avatar } from "@mui/material";
const base_url = import.meta.env.VITE_BASE_URL;

function UserList({
    handleUserClick,
    selectedBtn,
    selectedUser,
    getInitials,
}) {
    const contacts = useSelector((state) => state.contact.contact);
    const recentChats = useSelector((state) => state.recent.chat);
    const users = useSelector((state) => state.user.users);
    // console.log("contacts", contacts);
    // console.log("recents", recentChats);
    // console.log("users", users)

    return (
        <ul className="user-list">
            {selectedBtn === "recentChat" && (
                recentChats.length > 0 ? (
                    recentChats.map((chat, index) => {
                        const userFromDB = users.find(u => u.email === chat.email);
                        const displayName = chat.name || userFromDB?.name || "Unknown";
                        const profilePic = chat.ProfilePic || userFromDB?.ProfilePic;

                        return (
                            <li
                                key={index}
                                className={`user-item ${selectedUser?.id === chat.id ? "active-user" : ""}`}
                                onClick={() => handleUserClick(chat.id)}
                            >
                                <div className="profile">
                                    {profilePic ? (
                                        <img src={`${base_url}${profilePic}`} alt={displayName} className="profile-pic" />
                                    ) : (
                                        <div className="initials">{getInitials(displayName)}</div>
                                    )}
                                </div>

                                <div className="user-info">
                                    {contacts.some(c => c.email === chat.email) ? (
                                        <>
                                            <div className="user-name">{displayName}</div>
                                            <div className="user-email">{chat.email}</div>
                                        </>
                                    ) : (
                                        <div className="user-email only-mail">{chat.email}</div>
                                    )}
                                </div>
                            </li>
                        );
                    })
                ) : (
                    <div className="no-chat">No records found</div>
                )
            )}

            {selectedBtn === "myContact" ? (
                <>
                    {contacts.length > 0 ? (
                        contacts.map((c, index) => (
                            <li
                                key={index}
                                className={`user-item ${selectedUser?.id === c.id ? "active-user" : ""
                                    }`}
                                onClick={() => handleUserClick(c.id)}
                            >
                                <div className="profile">
                                    {users.find(u => u.email === c.email) ? (
                                        c.ProfilePic ? (
                                            <img
                                                src={`${base_url}${c.ProfilePic}`}
                                                alt={c.name}
                                                className="profile-pic"
                                            />
                                        ) : (
                                            <div className="initials">{getInitials(c.name)}</div>
                                        )
                                    ) : (
                                        <Avatar sx={{ backgroundColor: "#b0b3b8", boxShadow: "none", border: "none", outline: 'none' }} />
                                    )}
                                </div>

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
    );
}

export default UserList;
