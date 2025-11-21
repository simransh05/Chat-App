import React from 'react'
import AddContact from "../AddContact/AddContact";
import { Button, Tooltip } from "@mui/material";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { fetchContacts } from '../../Slices/contactSlice';
function AddContactButton({ currentUser, selectedBtn }) {
    const dispatch = useDispatch();
    const [showAddContact, setShowAddContact] = useState(false);
    return (
        <>
            {selectedBtn === "myContact" && (
                <Tooltip title="Add Contact" placement="right">
                    <Button
                        onClick={() => setShowAddContact(true)}
                        variant="contained"
                        color="primary"
                        sx={{ m: 2, backgroundColor: "#00a884",minWidth:0 , width: "40px", height: "30px" , borderRadius: "50%", fontSize: "24px", padding: ""}}
                        className="add-contact"
                    >
                        +
                    </Button>
                </Tooltip>
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
