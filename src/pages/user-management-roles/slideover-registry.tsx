/* eslint-disable import/no-cycle */
/* eslint-disable prettier/prettier */
import {
AddUser,
EditUser,
ViewUser,
AddRole,
EditRole,

} from '../../components/user-management'

/* Note: Product title load from "i18next" language file located at "/public/locales"  */
const SlideoverRegistry = {
  userManagement: {
    title: 'userManagement.title',
    component: <AddUser />,
  },
  editUserManagement: {
    title: 'editUserManagement.title',
    component: <EditUser />,
  },
  viewUserManagement: {
    title: 'viewUserManagement.title',
    component: <ViewUser />,
  },
  adduserManagementRoles: {
    title: 'addUserManagementRoles.title',
    component: <AddRole />,
  },
  edituserManagementRoles: {
    title: 'editUserManagementRoles.title',
    component: <EditRole />,
  },
  
}

export default SlideoverRegistry
