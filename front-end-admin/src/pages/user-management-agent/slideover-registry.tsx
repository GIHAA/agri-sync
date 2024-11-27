/* eslint-disable import/no-cycle */
/* eslint-disable prettier/prettier */
import {
AddAgent,
EditAgent,

} from '../../components/user-management'

/* Note: Product title load from "i18next" language file located at "/public/locales"  */
const SlideoverRegistry = {
  userManagementAgent: {
    title: 'addAgent.title',
    component: <AddAgent />,
  },
  editUserManagementAgent: {
    title: 'editAgent.title',
    component: <EditAgent />,
  },
  
}

export default SlideoverRegistry
