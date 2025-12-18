import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Avatar,
    Typography
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import api from "../../utils/Api";
import { fetchRecentChats } from "../../Slices/recentSlice";
const base_url = import.meta.env.VITE_BASE_URL;

function AddRecent({ open, onClose, handleUserClick, currentUser }) {
    const [email, setEmail] = useState("");
    const [searchedUser, setSearchedUser] = useState(null);
    const [notFound, setNotFound] = useState(false);

    const users = useSelector((state) => state.user.users);
    const contacts = useSelector((state) => state.contact.contact);
    const dispatch = useDispatch();

    const handleSearch = () => {
        const user = users.find(u => u.email === email);

        if (user) {
            setSearchedUser(user);
            setNotFound(false);
        } else {
            setSearchedUser(null);
            setNotFound(true);
        }
    };

    const handleStartChat = () => {
        const id = searchedUser._id;
        handleUserClick(id);
        handleClose();
    };
    const handleClose = () => {
        setEmail('');
        setSearchedUser(null);
        setNotFound(false)
        onClose();
    }

    const handleInvite = async () => {
        try {
            const sendData = {
                senderId: currentUser?._id,
                email
            };

            await api.postInvite(sendData);

            dispatch(fetchRecentChats(currentUser?._id));
            handleClose();

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth
            maxWidth="xs"
            PaperProps={{
                sx: {
                    width: "450px",
                    borderRadius: "10px",
                    paddingBottom: "10px"
                }
            }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>Add Recent Chat</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Enter Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setSearchedUser(null);
                        setNotFound(false);
                    }}
                    margin="normal"
                    required
                />
                {searchedUser && (
                    <div style={{ display: "flex", alignItems: "center", gap: "20px", margin: "15px", maxWidth: '400px' }}>

                        <Avatar>
                            {users.find(u => u.email === email).ProfilePic
                                ? (
                                    <img
                                        src={`${base_url}${users.find(u => u.email === email).ProfilePic}`}
                                        alt="profile"
                                        style={{ width: "100%", height: "100%" }}
                                    />
                                ) : (
                                    email[0]?.toUpperCase()
                                )
                            }
                        </Avatar>

                        <div>
                            {contacts.some(c => c.email === email) ? (
                                <>
                                    <Typography>{searchedUser.name}</Typography>
                                    <Typography variant="body2" color="gray">{searchedUser.email}</Typography>
                                </>
                            ) : (
                                <Typography variant="body2" color="gray">{searchedUser.email}</Typography>
                            )}
                        </div>

                        <Button
                            variant="contained"
                            onClick={handleStartChat}
                        >
                            Start Chat
                        </Button>
                    </div>
                )}

                {notFound && (
                    <div style={{ display: "flex", alignItems: "center", gap: "20px", margin: "15px", maxWidth: '400px' }}>
                        <Avatar>{email[0]?.toUpperCase()}</Avatar>
                        <div>
                            <Typography>{email}</Typography>
                            <Typography variant="body2" color="gray">Not on ChatApp</Typography>
                        </div>

                        <Button
                            variant="contained"
                            color="warning"
                            onClick={handleInvite}
                        >
                            Send Invite
                        </Button>
                    </div>
                )}

            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSearch} sx={{ marginRight: '8px' }}>Search</Button>
            </DialogActions>
        </Dialog >
    );
}

export default AddRecent;