import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/Api";

export const fetchRecentChats = createAsyncThunk(
    "recent/fetchRecentChats",
    async (id) => {
        const res = await api.recent(id)
        // console.log('using backend')
        return res.data;
    }
);

const recentSlice = createSlice({
    name: "recent",

    initialState: {
        chat: [],
        loading: false
    },

    reducers: {
        addRecentLocal: (state, action) => {
            const exists = state.chat.find(c => c._id === action.payload._id);

            if (!exists) state.chat.push(action.payload);
            else {
                const idx = state.chat.findIndex(c => c._id === action.payload._id);
                state.chat[idx] = action.payload;
            }
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchRecentChats.fulfilled, (state, action) => {
                state.chat = action.payload;
            });
    },
});

export const { addRecentLocal } = recentSlice.actions;
export default recentSlice.reducer;
