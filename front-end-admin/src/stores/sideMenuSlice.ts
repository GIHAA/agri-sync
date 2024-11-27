import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './store'
import { icons } from '../base-components/lucide'

// Interfaces
export interface Menu {
  icon: keyof typeof icons
  title: string
  pathname?: string
  subMenu?: Menu[]
  ignore?: boolean
}

export interface SideMenuState {
  menu: Array<Menu | 'devider'>
}

const permissionsToken = localStorage.getItem('validationToken')
let availablePermissons = permissionsToken ? JSON.parse(atob(permissionsToken.split('.')[1])) : { permissions: [] }

const hasPermission = (requiredPermission: string) => {
  if (availablePermissons.name === 'SUPER_ADMIN') {
    return true
  }
  return availablePermissons.permissions.includes(requiredPermission)
}

const initialState: SideMenuState = {
  menu: [
    {
      icon: 'Home',
      title: 'Home',
      pathname: '/dashboard',
    },
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
          pathname: '/agrisync-setting',
          title: 'Agrisync Settings',
        },
        {
          icon: 'Activity',
          pathname: '/gateway-setting',
          title: 'Gateways',
        },
      ],
    },
  ].filter(Boolean), 
}

export const sideMenuSlice = createSlice({
  name: 'sideMenu',
  initialState,
  reducers: {},
})

export const selectSideMenu = (state: RootState) => state.sideMenu.menu

export default sideMenuSlice.reducer
