import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/Api";

export const fetchCurrentUser = createAsyncThunk(
  "currentUser/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.currentUserFetch();
      return res.data; 
    } catch (err) {
      if (err.response?.status === 404 ) {
        return rejectWithValue("Not Login");
      }
      return rejectWithValue(err.message);
    }
  }
);


const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: {
    users: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.users = null;
        state.error = action.payload;
      });
  },
});

export default currentUserSlice.reducer;
