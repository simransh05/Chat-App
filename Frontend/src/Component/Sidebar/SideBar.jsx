import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from '../../Slices/userSlice';
import { Box, Tabs, Tab } from "@mui/material";
import UserList from './UserList';
import SidebarHeader from './SidebarHeader';
import SearchBar from './SearchBar';
import AddContactButton from './AddContactButton';
import api from "../../utils/Api";

function Sidebar({ currentUser, setSelectedUser, selectedUser, setMessages, getInitials, setCurrentUser, normalizeMsg }) {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.user.users);
    const contacts = useSelector((state) => state.contact.contact);
    const recentChats = useSelector((state) => state.recent.chat);
    const [selectedBtn, setSelectedBtn] = useState('recentChat');
    const [searchName, setSearchName] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    useEffect(() => {
        dispatch(fetchUsers(currentUser))
    }, [currentUser])
    const handleUserClick = async (name, email) => {
        try {
            const freshContacts = [...contacts];
            const freshUsers = [...users];

            const userExists = freshUsers.find(u => u.name === name);
            console.log("1", userExists)

            const contactEntry = freshContacts.find(c => c.name === name);
            console.log("2", freshUsers)
            const nextSelected = {
                id: userExists?._id || contactEntry?._id || userExists?.id || contactEntry?.id || '',
                name,
                email,
                existsInUserDB: userExists,
                inviteSent: contactEntry?.inviteSent === true
            };
            setSelectedUser(nextSelected);

            if (userExists && nextSelected?.id) {
                const res = await api.getHistory(currentUser.id, nextSelected?.id);
                console.log("res.data", res.data)
                setMessages((prev) => {
                    const newMessages = Array.isArray(res.data) ? res.data.map(normalizeMsg) : [];
                    return [...prev, ...newMessages];
                })
            }
        }
        catch (err) {
            console.error("Error loading chat:", err);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            const normalizeUser = (u) => ({
                name: u.name?.trim(),
                email: u.email || "",
                id: u._id || u.id || null,
            });

            const merged = [...recentChats, ...contacts].map(normalizeUser);
            const uniqueUsers = Array.from(
                new Map(merged.map((u) => [u.name.toLowerCase(), u])).values()
            );

            if (searchName.trim() === "") {
                setSearchResults(uniqueUsers);
            } else {
                const lower = searchName.toLowerCase();
                const match = uniqueUsers.filter((u) =>
                    u.name.toLowerCase().includes(lower)
                );
                setSearchResults(match);
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [searchName, contacts]);

    const handleChange = (_, value) => {
        setSelectedBtn(value);
    };


    return (
        <div className="sidebar">
            <div className="sidebar-header">

                <SidebarHeader
                    currentUser={currentUser}
                    getInitials={getInitials}
                    setCurrentUser={setCurrentUser}
                />

                <SearchBar
                    handleUserClick={handleUserClick}
                    searchResults={searchResults}
                    searchName={searchName}
                    setSearchName={setSearchName}
                    setSearchResults={setSearchResults}
                />
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs value={selectedBtn} onChange={handleChange}>
                        <Tab label="Recent Chat" value="recentChat" sx={{ width: '180px', "@media (max-width:600px)": { width: "30px" }, "@media (max-width:1100px)": { width: "40px" }, textTransform: "none" }} />
                        <Tab label="My Contact" value="myContact" sx={{ width: '180px', "@media (max-width:600px)": { width: "30px" }, "@media (max-width:1100px)": { width: "40px" }, textTransform: "none" }} />
                    </Tabs>
                </Box>
            </div>


            <UserList
                handleUserClick={handleUserClick}
                selectedBtn={selectedBtn}
                selectedUser={selectedUser}
                getInitials={getInitials}
            />

            <AddContactButton
                selectedBtn={selectedBtn}
                currentUser={currentUser}
            />
        </div>
    )
}

export default Sidebar
