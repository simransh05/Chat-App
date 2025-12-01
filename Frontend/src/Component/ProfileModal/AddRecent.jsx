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

function AddRecent({ open, onClose, setSelectedUser, currentUser }) {
    const [email, setEmail] = useState("");
    const [searchedUser, setSearchedUser] = useState(null);
    const [notFound, setNotFound] = useState(false);

    const users = useSelector((state) => state.user.users);
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
        setSelectedUser({
            id: searchedUser._id,
            name: searchedUser.name,
            email: searchedUser.email,
            existsInUserDB: true
        });

        dispatch(fetchRecentChats());
        onClose();
    };

    const handleInvite = async () => {
        try {
            const sendData = {
                senderId: currentUser.id,
                email
            };

            await api.postInvite(sendData);

            setSelectedUser({
                id: "",
                name: email,
                email,
                existsInUserDB: false,
                inviteSent: true
            });

            dispatch(fetchRecentChats());
            onClose();

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth
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
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    required
                />

                {searchedUser && (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "15px" }}>
                        <Avatar>{searchedUser.name[0]}</Avatar>
                        <div>
                            <Typography>{searchedUser.name}</Typography>
                            <Typography variant="body2" color="gray">{searchedUser.email}</Typography>
                        </div>

                        <Button
                            variant="contained"
                            sx={{ marginLeft: "auto" }}
                            onClick={handleStartChat}
                        >
                            Start Chat
                        </Button>
                    </div>
                )}

                {notFound && (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "15px", width:'190px'}}>
                        <Avatar>{email[0]?.toUpperCase()}</Avatar>
                        <div>
                            <Typography>{email}</Typography>
                            <Typography variant="body2" color="gray">Not on ChatApp</Typography>
                        </div>

                        <Button
                            variant="contained"
                            color="warning"
                            sx={{ marginLeft: "auto" }}
                            onClick={handleInvite}
                        >
                            Send Invite
                        </Button>
                    </div>
                )}

            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSearch} sx={{marginRight:'8px'}}>Search</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddRecent;