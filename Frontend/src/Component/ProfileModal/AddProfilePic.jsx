import React, { useState } from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    Avatar,
    Stack
} from "@mui/material";
import api from "../../utils/Api";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "../../Slices/currentUserSlice";
import { fetchRecentChats } from "../../Slices/recentSlice";
import { fetchContacts } from "../../Slices/contactSlice";
import { fetchUsers } from "../../Slices/userSlice";
const base_url = import.meta.env.VITE_BASE_URL;

function AddProfilePic({ open, currentUser, close }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(currentUser.ProfilePic || null);
    const [editName, setEditName] = useState(false);
    const [newName, setNewName] = useState(currentUser.name);
    const dispatch = useDispatch()

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

    const handleUpdate = async () => {
        try {
            if (newName.trim() && newName !== currentUser.name) {
                await api.updateName({
                    userId: currentUser._id,
                    name: newName,
                });
            }

            if (file) {
                const form = new FormData();
                form.append("ProfilePic", file);
                form.append("userId", currentUser._id);

                await api.uploadProfile(form);
            }

            dispatch(fetchCurrentUser());
            dispatch(fetchUsers(currentUser))

            close();
        } catch (err) {
            console.error(err);
            alert("Could not update profile info");
        }
    };



    return (
        <Modal open={open} onClose={close}>
            <Box
                sx={{
                    width: 380,
                    p: 4,
                    bgcolor: "background.paper",
                    borderRadius: 3,
                    mx: "auto",
                    mt: "10vh",
                    boxShadow: 24,
                    textAlign: "center",
                }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    {currentUser.ProfilePic ? "Update Profile Picture" : "Add Profile Picture"}
                </Typography>

                {editName ? (
                    <input
                        autoFocus
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        style={{
                            margin: "auto",
                            border: "1px solid #ccc",
                            padding: "5px 8px",
                            borderRadius: "5px",
                            fontSize: "16px",
                            width: "70%",
                            textAlign: "center"
                        }}
                    />
                ) : (
                    <Typography
                        onClick={() => setEditName(true)}
                        sx={{ cursor: "pointer", fontWeight: "bold", mt: 1, marginBottom: '6px' }}
                    >
                        {newName}
                    </Typography>
                )}

                <Typography sx={{ marginBottom: '8px' }}>
                    {currentUser.email}
                </Typography>

                <Stack spacing={2} alignItems="center">
                    {preview ? (
                        <Avatar
                            src={preview}
                            sx={{ width: 120, height: 120 }}
                        />
                    ) : (
                        <Avatar sx={{ width: 120, height: 120, bgcolor: "grey.300" }}>
                            No Pic
                        </Avatar>
                    )}

                    <label htmlFor="profile-file">
                        <Button
                            variant="contained"
                            component="span"
                            sx={{ textTransform: "none" }}
                        >
                            Choose File
                        </Button>

                        <input
                            id="profile-file"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                    </label>
                </Stack>

                <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: "center" }}>
                    <Button variant="outlined" onClick={close} sx={{ textTransform: "none" }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleUpdate} sx={{ textTransform: "none" }}>
                        Update
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
}

export default AddProfilePic;
