import { configureStore } from "@reduxjs/toolkit";
import accountsReducer from "./accountsSlice";

// The global store. Any component can read the table data from here.
export const store = configureStore({
  reducer: {
    accounts: accountsReducer,
  },
});
