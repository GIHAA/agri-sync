// // import { createSlice } from '@reduxjs/toolkit';
// // import { RootState } from './store';
// // import { icons } from '../base-components/lucide';

// // // Utility to decode Base64URL to Base64
// // function base64UrlDecode(base64Url: string): string {
// //   let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
// //   while (base64.length % 4) {
// //     base64 += '=';
// //   }
// //   return atob(base64);
// // }

// // // Interfaces
// // export interface Menu {
// //   icon: keyof typeof icons;
// //   title: string;
// //   pathname?: string;
// //   subMenu?: Menu[];
// //   ignore?: boolean;
// // }

// // export interface SideMenuState {
// //   menu: Array<Menu | 'devider'>;
// // }

// // // Safely decode permissionsToken
// // const permissionsToken = localStorage.getItem('validationToken');
// // let availablePermissions = { permissions: [] }; // Default empty permissions

// // if (permissionsToken) {
// //   try {
// //     const payload = permissionsToken.split('.')[1];
// //     const decodedPayload = base64UrlDecode(payload);
// //     availablePermissions = JSON.parse(decodedPayload);
// //   } catch (error) {
// //     console.error('Error decoding permissionsToken:', error);
// //   }
// // }

// // // Helper function to check permissions
// // const hasPermission = (requiredPermission: string): boolean => {
// //   if (availablePermissions.name === 'SUPER_ADMIN') {
// //     return true;
// //   }
// //   return availablePermissions.permissions.includes(requiredPermission);
// // };

// // // Initial state with conditional menu items
// // const initialState: SideMenuState = {
// //   menu: [
// //     {
// //       icon: 'Home',
// //       title: 'Home',
// //       pathname: '/dashboard',
// //     },
// //     hasPermission('user_management.view') && {
// //       icon: 'User',
// //       title: 'Admin Users',
// //       subMenu: [
// //         hasPermission('user_management.view') && {
// //           icon: 'Activity',
// //           pathname: '/manage-users',
// //           title: 'User List',
// //         },
// //         hasPermission('role_management.view') && {
// //           icon: 'Activity',
// //           pathname: '/manage-user-roles',
// //           title: 'User Roles',
// //         },
// //       ].filter(Boolean),
// //     },
// //     'devider',
// //     {
// //       icon: 'FileText',
// //       title: 'Reports',
// //       pathname: '/reports',
// //     },
// //     hasPermission('settings.view') && {
// //       icon: 'Settings',
// //       title: 'Settings',
// //       subMenu: [
// //         {
// //           icon: 'Activity',
// //           pathname: '/tip-setting',
// //           title: 'Tip Settings',
// //         },
// //         {
// //           icon: 'Activity',
// //           pathname: '/gateway-setting',
// //           title: 'Gateways',
// //         },
// //       ],
// //     },
// //   ].filter(Boolean), // Filter out falsey values
// // };

// // // Redux slice for side menu
// // export const sideMenuSlice = createSlice({
// //   name: 'sideMenu',
// //   initialState,
// //   reducers: {},
// // });

// // // Selector to access side menu
// // export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

// // export default sideMenuSlice.reducer;


// import { createSlice } from '@reduxjs/toolkit';
// import { RootState } from './store';
// import { icons } from '../base-components/lucide';

// // Interfaces
// export interface Menu {
//   icon: keyof typeof icons;
//   title: string;
//   pathname?: string;
//   subMenu?: Menu[];
//   ignore?: boolean;
// }

// export interface SideMenuState {
//   menu: Array<Menu | 'devider'>;
// }

// // Helper function to check permissions (directly check for SUPER_ADMIN role)
// const hasPermission = (requiredPermission: string): boolean => {
//   const permissionsToken = localStorage.getItem('validationToken');
//   if (permissionsToken) {
//     try {
//       const decoded = JSON.parse(atob(permissionsToken.split('.')[1]));
//       // Check if user role is SUPER_ADMIN
//       if (decoded.role === 'SUPER_ADMIN') {
//         return true;
//       }
//       // You can also add other permission checks if needed
//       return decoded.permissions.includes(requiredPermission);
//     } catch (error) {
//       console.error('Error parsing permissionsToken:', error);
//       return false;
//     }
//   }
//   return false;
// };

// // Initial state with conditional menu items
// const initialState: SideMenuState = {
//   menu: [
//     {
//       icon: 'Home',
//       title: 'Home',
//       pathname: '/dashboard',
//     },
//     {
//       icon: 'Activity',
//       pathname: '/manage-users',
//       title: 'User List',
//     },
//     // {
//     //   icon: 'Scanner',
//     //   title: 'QRScanner',
//     //   pathname: '/qr-scanner',
//     // },
//     hasPermission('user_management.view') && {
//       icon: 'User',
//       title: 'Admin Users',
//       subMenu: [
//         hasPermission('user_management.view') && {
//           icon: 'Activity',
//           pathname: '/manage-users',
//           title: 'User List',
//         },
//         hasPermission('role_management.view') && {
//           icon: 'Activity',
//           pathname: '/manage-user-roles',
//           title: 'User Roles',
//         },
//       ].filter(Boolean),
//     },
//     'devider',
//     {
//       icon: 'FileText',
//       title: 'Reports',
//       pathname: '/reports',
//     },
//     hasPermission('settings.view') && {
//       icon: 'Settings',
//       title: 'Settings',
//       subMenu: [
//         {
//           icon: 'Activity',
//           pathname: '/tip-setting',
//           title: 'Tip Settings',
//         },
//         {
//           icon: 'Activity',
//           pathname: '/gateway-setting',
//           title: 'Gateways',
//         },
//       ],
//     },
//   ].filter(Boolean), // Filter out falsy values
// };

// // Redux slice for side menu
// export const sideMenuSlice = createSlice({
//   name: 'sideMenu',
//   initialState,
//   reducers: {},
// });

// // Selector to access side menu
// export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

// export default sideMenuSlice.reducer;


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
    {
      icon: 'Home',
      title: 'Home',
      pathname: '/dashboard',
    },
    // {
    //    icon: 'Scanner',
    //   title: 'QRScanner',
    //    pathname: '/qr-scanner',
    //  },
    {
      icon: 'Activity',
      pathname: '/manage-users',
      title: 'User List',
    },
    // Use the permission checking for Admin Users only
    hasPermission('user_management.view') && {
      icon: 'User',
      title: 'Admin Users',
      subMenu: [
        hasPermission('user_management.view') && {
          icon: 'Activity',
          pathname: '/manage-users',
          title: 'User List',
        },
        hasPermission('role_management.view') && {
          icon: 'Activity',
          pathname: '/manage-user-roles',
          title: 'User Roles',
        },
      ].filter(Boolean),
    },
    'devider',
    {
      icon: 'FileText',
      title: 'Reports',
      pathname: '/reports',
    },
    hasPermission('settings.view') && {
      icon: 'Settings',
      title: 'Settings',
      subMenu: [
        {
          icon: 'Activity',
          pathname: '/tip-setting',
          title: 'Tip Settings',
        },
        {
          icon: 'Activity',
          pathname: '/gateway-setting',
          title: 'Gateways',
        },
      ],
    },
  ].filter(Boolean), // Filter out falsy values
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
