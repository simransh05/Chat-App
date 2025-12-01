import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import api from "../../utils/Api";
import { useDispatch } from "react-redux";
import { fetchRecentChats } from "../../Slices/recentSlice";


function AddContact({ open, onClose, onSuccess }) {
  const [data, setData] = useState({ name: "", email: "" });
  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    try {
      const login = JSON.parse(localStorage.getItem("login-info"));
      const id = login.user.id;
      const allData = { ...data, id };
      await api.postContact(allData);
      dispatch(fetchRecentChats())
      if (onSuccess) onSuccess(allData);
      onClose();
    } catch (error) {
      console.error("Failed to add contact", error);
      alert("Error adding contact!");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{display:'flex' , justifyContent:'center'}}>Add New Contact</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            onChange={handleChange}
            required
          />
          <DialogActions>
            <Button onClick={onClose} sx={{ textTransform: "none" }}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" sx={{ textTransform: "none" }}>
              Add
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddContact;