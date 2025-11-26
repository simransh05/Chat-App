import React, { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, TextField,
    DialogActions, Button
} from "@mui/material";
import Swal from "sweetalert2";
import api from "../../utils/Api";

function ResetPasswordModal({ open, onClose, currentUser }) {
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const handleResetPassword = async () => {
        if (!oldPass.trim() || !newPass.trim() || !confirmPass.trim()) {
            return Swal.fire("Error", "All fields are required", "error");
        }

        if (newPass !== confirmPass) {
            return Swal.fire("Error", "New Password & Confirm Password do not match", "error");
        }

        try {
            const payload = {
                userId: currentUser.id,
                oldPass,
                newPass
            };

            await api.resetPassword(payload);

            Swal.fire("Success", "Password updated successfully!", "success");
            onClose();

            setOldPass("");
            setNewPass("");
            setConfirmPass("");
        } catch (err) {
            Swal.fire("Error", err?.response?.data?.message || "Server Error", "error");
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: "12px", padding: "20px 25px" } }}
        >
            <DialogTitle sx={{ fontSize: "20px", fontWeight: 600, mb: 2 }}>
                Reset Password
            </DialogTitle>

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                    label="Old Password"
                    type="password"
                    fullWidth
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                />
                <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                />
                <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                />
            </DialogContent>

            <DialogActions sx={{ justifyContent: "space-between", mt: 1 }}>
                <Button onClick={onClose} sx={{ color: "#1976d2", fontWeight: 600 }}>
                    CANCEL
                </Button>
                <Button variant="contained" onClick={handleResetPassword} sx={{ px: 4 }}>
                    UPDATE
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ResetPasswordModal;