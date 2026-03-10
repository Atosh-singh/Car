import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios.js"

export const fetchLeads = createAsyncThunk(
  "leads/fetchLeads",
  async ({ page, limit, search }) => {

    const res = await API.get("/leads", {
      params: {
        page,
        limit,
        search
      }
    });

    return res.data;
  }
);

const leadSlice = createSlice({
  name: "leads",
  initialState: {
    leads: [],
    pagination: {},
    loading: false
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.data;
        state.pagination = action.payload.pagination;
      });
  }
});

export default leadSlice.reducer;