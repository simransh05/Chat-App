import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/Api";

const base_url = import.meta.env.VITE_BASE_URL;

export const fetchUsers = createAsyncThunk("user/fetchUsers", async (currentUser) => {
    const res = await api.userFetch(currentUser);
    console.log(currentUser)
    return res.data.map((u) => ({ name: u.name, email: u.email ,id:u._id }));
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
