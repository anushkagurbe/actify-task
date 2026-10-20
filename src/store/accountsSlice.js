import { createSlice } from "@reduxjs/toolkit";
import { dummyData } from "../data/dummyData";

// A slice holds one piece of global state (the table data) and the actions to change it
const accountsSlice = createSlice({
  name: "accounts",

  // Start with the hardcoded dummy data
  initialState: {
    list: dummyData,
  },

  reducers: {
    // Add a new account at the top of the list (used by the Create form)
    addAccount: (state, action) => {
      state.list.unshift(action.payload);
    },
  },
});

export const { addAccount } = accountsSlice.actions;
export default accountsSlice.reducer;
