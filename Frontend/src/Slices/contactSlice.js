import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/Api";

export const fetchContacts = createAsyncThunk(
    "contacts/fetchContacts",
    async () => {
        const userData = JSON.parse(localStorage.getItem("login-info"));
        const id = userData?.user?.id;
        const res = await api.contract(id)
        console.log('using backend')
        return res.data;
    }
);

const contactSlice = createSlice({
    name: "contacts",

    initialState: {
        contact: [],
        loading: false,
        error: null,
    },

    reducers: {
        addContactLocal: (state, action) => {
            state.contact.push(action.payload);
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchContacts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchContacts.fulfilled, (state, action) => {
                state.loading = false;
                state.contact = action.payload;
            })
            .addCase(fetchContacts.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { addContactLocal } = contactSlice.actions;
export default contactSlice.reducer;
