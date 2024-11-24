/* eslint-disable import/no-cycle */
/* eslint-disable prettier/prettier */
import {
  AddCustomers,
  AddFollowUp,
  EditCustomers,
  EditFollowUp,
} from '../../components/leads'

/* Note: Product title load from "i18next" language file located at "/public/locales"  */
const SlideoverRegistry = {
  addCustomer: {
    title: 'contactManagement.fields.customers.fields.addContact.title',
    component: <AddCustomers />,
  },
  addFollowUp: {
    title: 'lead.fields.addFollowUp.title',
    component: <AddFollowUp />,
  },
  editCustomer: {
    title: 'lead.fields.editContact.title',
    component: <EditCustomers />,
  },
  editFollowUp: {
    title: 'lead.fields.editFollowUp.title',
    component: <EditFollowUp />,
  },
  
}

export default SlideoverRegistry
