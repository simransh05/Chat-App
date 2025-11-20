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
    console.log(contacts);
    console.log(recentChats);
    console.log(users)

    return (
        <ul className="user-list">
            {selectedBtn === "recentChat" ? (
                <>
                    {recentChats.length > 0 ? (
                        recentChats.map((chat, index) => (
                            <li
                                key={index}
                                className={`user-item ${selectedUser.name === chat.name ? "active-user" : ""
                                    }`}
                                onClick={() => handleUserClick(chat.name, chat.email)}
                            >
                                <div className="profile">
                                    {chat.ProfilePic ? (
                                        <img
                                            src={`${chat.ProfilePic}`}
                                            alt={chat.name}
                                            className="profile-pic"
                                        />
                                    ) : (
                                        <div className="initials">{getInitials(chat.name)}</div>
                                    )}
                                </div>

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
            ) : null}

            {selectedBtn === "myContact" ? (
                <>
                    {contacts.length > 0 ? (
                        contacts.map((c, index) => (
                            <li
                                key={index}
                                className={`user-item ${selectedUser.name === c.name ? "active-user" : ""
                                    }`}
                                onClick={() => handleUserClick(c.name, c.email)}
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
                                        <Avatar></Avatar>
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
