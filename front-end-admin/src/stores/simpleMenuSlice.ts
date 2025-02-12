/* eslint-disable import/no-cycle */
/* eslint-disable prettier/prettier */
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "../components/common/lucide";

export interface Menu {
  icon: keyof typeof icons;
  title: string;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SimpleMenuState {
  menu: Array<Menu | "devider">;
}

const initialState: SimpleMenuState = {
  menu: [
    {
      icon: "Home",
      title: "Dashboard",
      subMenu: [
        {
          icon: "Activity",
          pathname: "/simple-menu/dashboard-overview-1",
          title: "Overview 1",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/dashboard-overview-2",
          title: "Overview 2",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/dashboard-overview-3",
          title: "Overview 3",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/dashboard-overview-4",
          title: "Overview 4",
        },
      ],
    },
    {
      icon: "Box",
      title: "Menu Layout",
      subMenu: [
        {
          icon: "Activity",
          pathname: "/",
          title: "Side Menu",
          ignore: true,
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/dashboard-overview-1",
          title: "Simple Menu",
          ignore: true,
        },
        {
          icon: "Activity",
          pathname: "/top-menu/dashboard-overview-1",
          title: "Top Menu",
          ignore: true,
        },
      ],
    },
    {
      icon: "ShoppingBag",
      title: "E-Commerce",
      subMenu: [
        {
          icon: "Activity",
          pathname: "/simple-menu/categories",
          title: "Categories",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/add-product",
          title: "Add Product",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/products",
          title: "Products",
          subMenu: [
            {
              icon: "Zap",
              pathname: "/simple-menu/product-list",
              title: "Product List",
            },
            {
              icon: "Zap",
              pathname: "/simple-menu/product-grid",
              title: "Product Grid",
            },
          ],
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/transactions",
          title: "Transactions",
          subMenu: [
            {
              icon: "Zap",
              pathname: "/simple-menu/transaction-list",
              title: "Transaction List",
            },
            {
              icon: "Zap",
              pathname: "/simple-menu/transaction-detail",
              title: "Transaction Detail",
            },
          ],
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/sellers",
          title: "Sellers",
          subMenu: [
            {
              icon: "Zap",
              pathname: "/simple-menu/seller-list",
              title: "Seller List",
            },
            {
              icon: "Zap",
              pathname: "/simple-menu/seller-detail",
              title: "Seller Detail",
            },
          ],
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/reviews",
          title: "Reviews",
        },
      ],
    },
    {
      icon: "Inbox",
      pathname: "/simple-menu/inbox",
      title: "Inbox",
    },
    {
      icon: "HardDrive",
      pathname: "/simple-menu/file-manager",
      title: "File Manager",
    },
    {
      icon: "CreditCard",
      pathname: "/simple-menu/point-of-sale",
      title: "Point of Sale",
    },
    {
      icon: "MessageSquare",
      pathname: "/simple-menu/chat",
      title: "Chat",
    },
    {
      icon: "FileText",
      pathname: "/simple-menu/post",
      title: "Post",
    },
    {
      icon: "Calendar",
      pathname: "/simple-menu/calendar",
      title: "Calendar",
    },
    "devider",
    {
      icon: "Edit",
      title: "Crud",
      subMenu: [
        {
          icon: "Activity",
          pathname: "/simple-menu/crud-data-list",
          title: "Data List",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/crud-form",
          title: "Form",
        },
      ],
    },
    {
      icon: "Users",
      title: "Users",
      subMenu: [
        {
          icon: "Activity",
          pathname: "/simple-menu/users-layout-1",
          title: "Layout 1",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/users-layout-2",
          title: "Layout 2",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/users-layout-3",
          title: "Layout 3",
        },
      ],
    },
    {
      icon: "Trello",
      title: "Profile",
      subMenu: [
        {
          icon: "Activity",
          pathname: "/simple-menu/profile-overview-1",
          title: "Overview 1",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/profile-overview-2",
          title: "Overview 2",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/profile-overview-3",
          title: "Overview 3",
        },
      ],
    },
    {
      icon: "Layout",
      title: "Pages",
      subMenu: [
        {
          icon: "Activity",
          title: "Wizards",
          subMenu: [
            {
              icon: "Zap",
              pathname: "/simple-menu/wizard-layout-1",
              title: "Layout 1",
            },
            {
              icon: "Zap",
              pathname: "/simple-menu/wizard-layout-2",
              title: "Layout 2",
            },
            {
              icon: "Zap",
              pathname: "/simple-menu/wizard-layout-3",
              title: "Layout 3",
            },
          ],
        },
        {
          icon: "Activity",
          title: "Blog",
          subMenu: [
            {
              icon: "Zap",
              pathname: "/simple-menu/blog-layout-1",
              title: "Layout 1",
            },
            {
              icon: "Zap",
              pathname: "/simple-menu/blog-layout-2",
              title: "Layout 2",
            },
            {
              icon: "Zap",
              pathname: "/simple-menu/blog-layout-3",
              title: "Layout 3",
            },
          ],
        },
        {
          icon: "Activity",
          title: "Pricing",
          subMenu: [
            {
              icon: "Zap",
              pathname: "/simple-menu/pricing-layout-1",
              title: "Layout 1",
            },
            {
              icon: "Zap",
              pathname: "/simple-menu/pricing-layout-2",
              title: "Layout 2",
            },
          ],
        },
        {
          icon: "Activity",
          title: "Invoice",
          subMenu: [
            {
              icon: "Zap",
              pathname: "/simple-menu/invoice-layout-1",
              title: "Layout 1",
            },
            {
              icon: "Zap",
              pathname: "/simple-menu/invoice-layout-2",
              title: "Layout 2",
            },
          ],
        },
        {
          icon: "Activity",
          title: "FAQ",
          subMenu: [
            {
              icon: "Zap",
              pathname: "/simple-menu/faq-layout-1",
              title: "Layout 1",
            },
            {
              icon: "Zap",
              pathname: "/simple-menu/faq-layout-2",
              title: "Layout 2",
            },
            {
              icon: "Zap",
              pathname: "/simple-menu/faq-layout-3",
              title: "Layout 3",
            },
          ],
        },
        {
          icon: "Activity",
          pathname: "login",
          title: "Login",
        },
        {
          icon: "Activity",
          pathname: "register",
          title: "Register",
        },
        {
          icon: "Activity",
          pathname: "error-page",
          title: "Error Page",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/update-profile",
          title: "Update profile",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/change-password",
          title: "Change Password",
        },
      ],
    },
    "devider",
    {
      icon: "Inbox",
      title: "Components",
      subMenu: [
        {
          icon: "Activity",
          title: "Table",
          subMenu: [
            {
              icon: "Zap",
              pathname: "/simple-menu/regular-table",
              title: "Regular Table",
            },
            {
              icon: "Zap",
              pathname: "/simple-menu/tabulator",
              title: "Tabulator",
            },
          ],
        },
        {
          icon: "Activity",
          title: "Overlay",
          subMenu: [
            {
              icon: "Zap",
              pathname: "/simple-menu/modal",
              title: "Modal",
            },
            {
              icon: "Zap",
              pathname: "/simple-menu/slide-over",
              title: "Slide Over",
            },
            {
              icon: "Zap",
              pathname: "/simple-menu/notification",
              title: "Notification",
            },
          ],
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/tab",
          title: "Tab",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/accordion",
          title: "Accordion",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/button",
          title: "Button",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/alert",
          title: "Alert",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/progress-bar",
          title: "Progress Bar",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/tooltip",
          title: "Tooltip",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/dropdown",
          title: "Dropdown",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/typography",
          title: "Typography",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/icon",
          title: "Icon",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/loading-icon",
          title: "Loading Icon",
        },
      ],
    },
    {
      icon: "Sidebar",
      title: "Forms",
      subMenu: [
        {
          icon: "Activity",
          pathname: "/simple-menu/regular-form",
          title: "Regular Form",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/datepicker",
          title: "Datepicker",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/tom-select",
          title: "Tom Select",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/file-upload",
          title: "File Upload",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/wysiwyg-editor",
          title: "Wysiwyg Editor",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/validation",
          title: "Validation",
        },
      ],
    },
    {
      icon: "HardDrive",
      title: "Widgets",
      subMenu: [
        {
          icon: "Activity",
          pathname: "/simple-menu/chart",
          title: "Chart",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/slider",
          title: "Slider",
        },
        {
          icon: "Activity",
          pathname: "/simple-menu/image-zoom",
          title: "Image Zoom",
        },
      ],
    },
  ],
};

export const simpleMenuSlice = createSlice({
  name: "simpleMenu",
  initialState,
  reducers: {},
});

export const selectSimpleMenu = (state: RootState) => state.simpleMenu.menu;

export default simpleMenuSlice.reducer;
