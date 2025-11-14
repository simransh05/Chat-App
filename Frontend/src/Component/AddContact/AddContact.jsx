import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";

const base_url = import.meta.env.VITE_BASE_URL;

function AddContact({ open, onClose, onSuccess }) {
  const [data, setData] = useState({ name: "", email: "" });

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

      await axios.post(`${base_url}/contact`, allData);
      if (onSuccess) onSuccess(allData);
      onClose();
    } catch (error) {
      console.error("Failed to add contact", error);
      alert("Error adding contact!");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Contact</DialogTitle>
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
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Add
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddContact;