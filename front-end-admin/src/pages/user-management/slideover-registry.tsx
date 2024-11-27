
import { AddUser, EditUser, ViewUser } from '../../components/user-management'

export interface FormContents {
  title: string
  component: JSX.Element | ((props: { userId: string }) => JSX.Element)
}
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


}

export default SlideoverRegistry
