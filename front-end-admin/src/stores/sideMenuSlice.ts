

import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';
import { icons } from '../base-components/lucide';

// Interfaces
export interface Menu {
  icon: keyof typeof icons;
  title: string;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SideMenuState {
  menu: Array<Menu | 'devider'>;
}

// Helper function to check permissions (directly check for SUPER_ADMIN role)
const hasPermission = (requiredPermission: string): boolean => {
  const permissionsToken = localStorage.getItem('validationToken');
  if (permissionsToken) {
    try {
      const decoded = JSON.parse(atob(permissionsToken.split('.')[1]));
      // Check if user role is SUPER_ADMIN
      if (decoded.role === 'SUPER_ADMIN') {
        return true;
      }
      // You can also add other permission checks if needed
      return decoded.permissions.includes(requiredPermission);
    } catch (error) {
      console.error('Error parsing permissionsToken:', error);
      return false;
    }
  }
  return false;
};

// Initial state with conditional menu items
const initialState: SideMenuState = {
  menu: [
    // {
    //   icon: "Home" as keyof typeof icons,
    //   title: 'Home',
    //   pathname: '/dashboard',
    // },
    {
      icon: "Award" as keyof typeof icons,
      pathname: '/reward-management',
      title: 'Reward Management',
    },
    {
      icon: "Users" as keyof typeof icons,
      pathname: '/user-management',
      title: 'User Management',
    },
    {
      icon: "Expand" as keyof typeof icons,
      pathname: '/user-interaction-management',
      title: 'UI Management',
    },
    {
      icon: "QrCode" as keyof typeof icons,
      pathname: '/qr-scanner',
      title: 'QR Scanner',
    },
    {
      icon: "Activity" as keyof typeof icons,
      pathname: '/table',
      title: 'Seed Transactions',
    },

  ].filter(Boolean), 
};

// Redux slice for side menu
export const sideMenuSlice = createSlice({
  name: 'sideMenu',
  initialState,
  reducers: {},
});

// Selector to access side menu
export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export default sideMenuSlice.reducer;
