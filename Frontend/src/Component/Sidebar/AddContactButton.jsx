import React from 'react'
import AddContact from "../AddContact/AddContact";
import { Button, Tooltip } from "@mui/material";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { fetchContacts } from '../../Slices/contactSlice';
import AddRecent from '../ProfileModal/AddRecent';
function AddContactButton({ currentUser, selectedBtn, handleUserClick }) {
    const dispatch = useDispatch();
    const [showAddContact, setShowAddContact] = useState(false);
    const [showRecent, setShowRecent] = useState(false)
    return (
        <>
            {selectedBtn === 'myContact' ? (
                <>
                    <Tooltip title="Add Contact" placement="right">
                        <Button
                            onClick={() => setShowAddContact(true)}
                            variant="contained"
                            color="primary"
                            sx={{ m: 2, backgroundColor: "#00a884", minWidth: 0, width: "56px", height: "56px", borderRadius: "50%", fontSize: "24px", padding: "0" }}
                            className="add-contact"
                        >
                            +
                        </Button>
                    </Tooltip>

                    <AddContact
                        open={showAddContact}
                        onClose={() => setShowAddContact(false)}
                        onSuccess={() => dispatch(fetchContacts(currentUser?._id))}
                    />
                </>
            ) : (
                <>
                    <Tooltip title="Add Recent Chat" placement="right">
                        <Button
                            onClick={() => setShowRecent(true)}
                            variant="contained"
                            color="primary"
                            sx={{ m: 2, backgroundColor: "#00a884", minWidth: 0, width: "56px", height: "56px", borderRadius: "50%", fontSize: "24px", padding: "0" }}
                            className="add-contact"
                        >
                            +
                        </Button>
                    </Tooltip>
                    <AddRecent
                        open={showRecent}
                        onClose={() => setShowRecent(false)}
                        handleUserClick={handleUserClick}
                        currentUser={currentUser}
                    />
                </>
            )}



        </>
    )
}

export default AddContactButton
