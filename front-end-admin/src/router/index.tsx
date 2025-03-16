/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { useRoutes } from 'react-router-dom'
import RouteRegistry from './router-registry'
import Error from '../pages/error'
import SideMenu from '../layouts/SimpleMenu'
import TopMenu from '../layouts/TopMenu'
import Roles from '../pages/user-management-roles'
import CustomerNotify from '../pages/notificationTemplates/customerNotifications'
import Login from '../pages/login'
import Dashboard from '../pages/dashboard'
import UpdateProfile from '../pages/update-profile'
import Tabulator from '../pages/tabulator'
import Drag from '../pages/drag/drag'
import Table from '../pages/table'
import PrivateRoute from './PrivateRoute'
import Scanner from '../pages/qr-scanner/FarmerDetails'

import {
  CommonComponent,
  DatepickerComponent,
  SelectComponent,
  ValidateComponent,
  WysiwygEditor,
  FormComponent,
  ButtonCom,
  ImageUploadComponent,
  ProgressComponent,
} from '../pages/forms'
import AdminUserManagePage from '../pages/admin-management/admin-users'
import AdminUserRolesManagePage from '../pages/admin-management/admin-user-roles'
import RewardManagementPage from '../pages/reward-management/reward-management'
import UIManagementPage from '../pages/user-interaction-management/reward-management'

function Router() {
  const { error } = RouteRegistry

  const routes = [
    {
      path: '/',
      element: (
        // <PrivateRoute>

        // </PrivateRoute>

        <SideMenu />
      ),
      children: [
        // {
          // path: '/',
          // element: <Dashboard />,
        // },
        {
          path: '/qr-scanner',
          element: <Scanner />,
        },
        {
          path: 'form',
          element: <FormComponent />,
        },
        {
          path: 'user-management',
          element: <AdminUserManagePage />,
        },
        {
          path: 'reward-management',
          element: <RewardManagementPage />,
        },
        {
          path: '/user-interaction-management',
          element: <UIManagementPage />,
        },
        {
          path: 'manage-user-roles',
          element: <AdminUserRolesManagePage />,
        },
        {
          path: 'user-management-roles',
          element: <Roles />,
        },
        {
          path: '/tabulator',
          element: <Tabulator />,
        },
        {
          path: '/table',
          element: <Table />,
        },
        {
          path: 'notificationTemplates/customerNotifications',
          element: <CustomerNotify />,
        },
        // {
        //   path: 'dashboard',
        //   element: <Dashboard />,
        // },
        {
          path: 'update-profile',
          element: <UpdateProfile />,
        },
        {
          path: 'drag',
          element: <Drag />,
        },
      ],
    },
    {
      path: '/user-management-roles',
      element: <Roles />,
    },

    {
      path: '/form',
      element: <FormComponent />,
    },
    {
      path: '/form/common',
      element: <CommonComponent />,
    },
    {
      path: '/form/validation',
      element: <ValidateComponent />,
    },
    {
      path: '/form/datepicker',
      element: <DatepickerComponent />,
    },
    {
      path: '/form/select',
      element: <SelectComponent />,
    },
    {
      path: '/form/editor',
      element: <WysiwygEditor />,
    },
    {
      path: '/form/button',
      element: <ButtonCom />,
    },
    {
      path: '/form/imageupload',
      element: <ImageUploadComponent />,
    },
    {
      path: '/progress',
      element: <ProgressComponent />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    /* END */
    {
      path: error.path,
      element: <Error />,
    },
    {
      path: '*',
      element: <Error />,
    },
  ]

  return useRoutes(routes)
}

export default Router
