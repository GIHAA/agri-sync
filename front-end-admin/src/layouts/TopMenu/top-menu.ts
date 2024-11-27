/* eslint-disable no-param-reassign */
/* eslint-disable no-lonely-if */
/* eslint-disable prettier/prettier */
import { NavigateFunction } from "react-router-dom";
import { Menu } from "../../stores/sideMenuSlice";

interface Location {
  pathname: string;
  forceActiveMenu?: string;
}

export interface FormattedMenu extends Menu {
  active?: boolean;
  activeDropdown?: boolean;
  subMenu?: FormattedMenu[];
}

// Setup top menu
const findActiveMenu = (subMenu: Menu[], location: Location): boolean => {
  let match = false;
  subMenu.forEach((item) => {
    if (
      ((location.forceActiveMenu !== undefined &&
        item.pathname === location.forceActiveMenu) ||
        (location.forceActiveMenu === undefined &&
          item.pathname === location.pathname)) &&
      !item.ignore
    ) {
      match = true;
    } else if (!match && item.subMenu) {
      match = findActiveMenu(item.subMenu, location);
    }
  });
  return match;
};

const nestedMenu = (menu: Array<Menu>, location: Location) => {
  const formattedMenu: Array<FormattedMenu> = [];
  menu.forEach((item) => {
    const menuItem: FormattedMenu = {
      icon: item.icon,
      title: item.title,
      pathname: item.pathname,
      subMenu: item.subMenu,
      ignore: item.ignore,
    };
    menuItem.active =
      ((location.forceActiveMenu !== undefined &&
        menuItem.pathname === location.forceActiveMenu) ||
        (location.forceActiveMenu === undefined &&
          menuItem.pathname === location.pathname) ||
        (menuItem.subMenu && findActiveMenu(menuItem.subMenu, location))) &&
      !menuItem.ignore;

    if (menuItem.subMenu) {
      menuItem.activeDropdown = findActiveMenu(menuItem.subMenu, location);

      // Nested menu
      menuItem.subMenu = nestedMenu(menuItem.subMenu, location);
    }

    formattedMenu.push(menuItem);
  });

  return formattedMenu;
};

const linkTo = (menu: FormattedMenu, navigate: NavigateFunction) => {
  if (menu.subMenu) {
    menu.activeDropdown = !menu.activeDropdown;
  } else {
    if (menu.pathname !== undefined) {
      navigate(menu.pathname);
    }
  }
};

export { nestedMenu, linkTo };
