export const Permissions: { [key: string]: { [key: string]: string } } = {
  user_management: {
    view: 'user_management.view',
    add: 'user_management.add',
    edit: 'user_management.edit',
    deactivate: 'user_management.deactivate',
    delete: 'user_management.delete',
  },
  role_management: {
    view: 'role_management.view',
    add: 'role_management.add',
    edit: 'role_management.edit',
    deactivate: 'role_management.deactivate',
    delete: 'role_management.delete',
  },
  tp_management: {
    view: 'tp_management.view',
    change_status: 'tp_management.change_status',
    deactivate: 'tp_management.deactivate',
    delete: 'tp_management.delete',
  },
  sp_management: {
    view: 'sp_management.view',
    change_status: 'sp_management.change_status',
    deactivate: 'sp_management.deactivate',
    delete: 'sp_management.delete',
  },
  review_management: {
    view: 'review_management.view',
    hide: 'review_management.hide',
    delete: 'review_management.delete',
  },
  footer_management: {
    view: 'footer_management.view',
    add: 'footer_management.add',
    edit: 'footer_management.edit',
  },
  faq_management: {
    view: 'faq_management.view',
    add: 'faq_management.add',
    edit: 'faq_management.edit',
    deactivate: 'faq_management.deactivate',
  },
  faq_category: {
    view: 'faq_category.view',
    add: 'faq_category.add',
    edit: 'faq_category.edit',
    deactivate: 'faq_category.deactivate',
  },
  announcement: {
    view: 'announcement.view',
    add: 'announcement.add',
    delete: 'announcement.delete',
  },
  settings: {
    view: 'settings.view',
    add: 'settings.add',
  },
}