import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from '../../Slices/userSlice';
import { Box, Tabs, Tab } from "@mui/material";
import UserList from './UserList';
import SidebarHeader from './SidebarHeader';
import SearchBar from './SearchBar';
import AddContactButton from './AddContactButton';
import api from "../../utils/Api";
import { fetchContacts } from "../../Slices/contactSlice";
import { fetchRecentChats } from "../../Slices/recentSlice";

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
    const handleUserClick = async (id) => {
        try {
            const freshContacts = [...contacts];
            const freshUsers = [...users];

            const userExists = freshUsers.find(u => u._id === id || u.id === id);
            console.log("1", userExists)

            const contactEntry = freshContacts.find(c => c.id === id);
            const name = contactEntry?.name || userExists?.name || "";
            const email = contactEntry?.email || userExists?.email || "";
            console.log()
            console.log("2", contactEntry)
            const nextSelected = {
                id: userExists?._id  || userExists?.id ||  '',
                name,
                email,
                existsInUserDB: !!userExists,
                inviteSent: contactEntry?.inviteSent === true
            };
            setSelectedUser(nextSelected);
            console.log('fetch')

            if (nextSelected?.id) {
                const res = await api.getHistory(currentUser._id, nextSelected?.id);
                const newMessages = Array.isArray(res.data) ? res.data.map(normalizeMsg) : [];
                setMessages(newMessages);
            }else {
                return;
            }
            // for updating the user profile pic if there is present
            dispatch(fetchContacts(currentUser?._id));
            dispatch(fetchRecentChats(currentUser?._id))
        }
        catch (err) {
            console.error("Error loading chat:", err);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            const normalizeUser = (u) => ({
                name: u.name?.trim(),
                email: u?.email || "",
                id: u._id || u.id || null,
            });

            const merged = [...recentChats, ...contacts].map(normalizeUser);
            const uniqueUsers = Array.from(
                new Map(merged.filter(u => u && u.name).map((u) => [u.name.toLowerCase(), u])).values()
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
                    <Tabs value={selectedBtn} onChange={handleChange} sx={{ display: 'flex' }}>
                        <Tab label="Recent Chat" value="recentChat" sx={{
                            width: '180px',
                            "@media (max-width:1100px)": { width: "120px" },
                            "@media (max-width:900px)": { width: "95px" },
                            "@media (max-width:700px)": { width: "30px" },
                            textTransform: "none"
                        }} />
                        <Tab label="My Contact" value="myContact" sx={{
                            width: '180px',
                            "@media (max-width:1100px)": { width: "120px" },
                            "@media (max-width:900px)": { width: "95px" },
                            "@media (max-width:700px)": { width: "30px" },
                            textTransform: "none"
                        }} />
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
                handleUserClick={handleUserClick}
            />
        </div>
    )
}

export default Sidebar
