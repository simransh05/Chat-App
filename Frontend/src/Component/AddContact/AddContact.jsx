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
import { useDispatch, useSelector } from "react-redux";
import { fetchRecentChats } from "../../Slices/recentSlice";


function AddContact({ open, onClose, onSuccess }) {
  const login = useSelector((state)=>state.currentUser.users);
  const [data, setData] = useState({ name: "", email: "" });
  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    try {
      const id = login._id;
      const allData = { ...data, id };
      await api.postContact(allData);
      dispatch(fetchRecentChats(login?._id))
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