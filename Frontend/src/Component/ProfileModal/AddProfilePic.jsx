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

function AddProfilePic({ open, currentUser, close, onUpload }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(`${base_url}${currentUser.ProfilePic}` || null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
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

                <Typography>
                    {currentUser.name}
                </Typography>

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

                    <Button variant="contained" component="label" sx={{ textTransform: "none" }}>
                        Choose File
                        <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                    </Button>
                </Stack>

                <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: "center" }}>
                    <Button variant="outlined" onClick={close} sx={{ textTransform: "none" }}>
                        Cancel
                    </Button>
                    <Button variant="contained" disabled={!file} onClick={()=> uploadFile(file)} sx={{ textTransform: "none" }}>
                        {currentUser.ProfilePic ? "Update" : "Upload"}
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
}

export default AddProfilePic;
