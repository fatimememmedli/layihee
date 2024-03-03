import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AdminSliceType {
  navbar: boolean;
}

const initialState: AdminSliceType = {
  navbar: false,
};
export const AdminSLice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    ChangeAdminNavbarState: (state, action: PayloadAction<boolean>) => {
      state.navbar = action.payload;
    },
   
  },
});

export const { ChangeAdminNavbarState } = AdminSLice.actions;
export default AdminSLice.reducer;
