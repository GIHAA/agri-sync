/* eslint-disable import/no-cycle */
/* eslint-disable prettier/prettier */
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store"
import { icons } from "../components/common/lucide"

export interface Menu {
  icon: keyof typeof icons;
  title: string;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface TopMenuState {
  menu: Array<Menu>;
}

const initialState: TopMenuState = {
  menu: [
    {
      icon: 'Users',
      title: 'User Management',
      subMenu: [
        {
          icon: 'Activity',
          pathname: '/top-menu/user-management-user',
          title: 'User',
        },
        {
          icon: 'Activity',
          pathname: '/top-menu/user-management-roles',
          title: 'Roles',
        },
        {
          icon: 'Activity',
          pathname: '/top-menu/user-management-agent',
          title: 'Agent',
        },
        {
          icon: 'Activity',
          pathname: '/top-menu/user-management-fixedCommission',
          title: 'Fixed Commission',
        },
      ],
    },
    {
      icon: 'Book',
      title: 'Contacts',
      subMenu: [
        {
          icon: 'Activity',
          pathname: '/top-menu/contact-management/suppliers',
          title: 'Suppliers',
        },
      ],
    },
  ],
};

export const topMenuSlice = createSlice({
  name: "topMenu",
  initialState,
  reducers: {},
});

export const selectTopMenu = (state: RootState) => state.topMenu.menu;

export default topMenuSlice.reducer;
