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
const base_url = import.meta.env.VITE_BASE_URL;

function AddProfilePic({ open, currentUser, close, onUpload, setCurrentUser }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(`${base_url}${currentUser.ProfilePic}` || null);
    const [editName, setEditName] = useState(false);
    const [newName, setNewName] = useState(currentUser.name);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

    const updateName = async () => {
        if (newName === currentUser.name || newName.trim() === "") {
            setEditName(false);
            return;
        }
        try {
            const info = JSON.parse(localStorage.getItem("login-info"));

            const res = await api.updateName({
                userId: info.user.id,
                name: newName
            });

            info.user.name = newName;
            localStorage.setItem("login-info", JSON.stringify(info));

            setCurrentUser({ ...currentUser, name: newName })

            setEditName(false);
        } catch (err) {
            console.log(err);
            alert("Could not update name");
        }
    };


    const uploadFile = async (file) => {
        const info = JSON.parse(localStorage.getItem("login-info"));
        const form = new FormData(); // for sending the files to the backend
        form.append("ProfilePic", file);
        form.append("userId", info.user.id);
        const res = await api.uploadProfile(form);
        console.log(res.data.ProfilePic)
        info.user.ProfilePic = res.data.ProfilePic;
        localStorage.setItem("login-info", JSON.stringify(info));
        setPreview(res.data.ProfilePic);
        onUpload(res.data.ProfilePic);
        close();
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
                        onBlur={updateName}
                        style={{
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
                        sx={{ cursor: "pointer", fontWeight: "bold", mt: 1 }}
                    >
                        {newName}
                    </Typography>
                )}

                <Typography>
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
                    <Button variant="contained" disabled={!file} onClick={() => uploadFile(file)} sx={{ textTransform: "none" }}>
                        {currentUser.ProfilePic ? "Update" : "Upload"}
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
}

export default AddProfilePic;
