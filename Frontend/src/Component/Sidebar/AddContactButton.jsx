import React from 'react'
import AddContact from "../AddContact/AddContact";
import { Button } from "@mui/material";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { fetchContacts } from '../../Slices/contactSlice';
function AddContactButton({ currentUser, selectedBtn }) {
    const dispatch = useDispatch();
    const [showAddContact, setShowAddContact] = useState(false);
    return (
        <>
            {selectedBtn === "myContact" && (
                <Button
                    onClick={() => setShowAddContact(true)}
                    variant="contained"
                    color="primary"
                    sx={{ m: 2 }}
                    className="add-contact"
                >
                    Add Contact
                </Button>
            )}

            <AddContact
                open={showAddContact}
                onClose={() => setShowAddContact(false)}
                onSuccess={() => dispatch(fetchContacts(currentUser))}
            />
        </>
    )
}

export default AddContactButton
