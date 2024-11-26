/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-lonely-if */
import { NavigateFunction } from 'react-router-dom'
import { Menu } from '../../stores/sideMenuSlice'
import { slideUp, slideDown } from '../../utils/helper'

interface Location {
  pathname: string
  forceActiveMenu?: string
}

export interface FormattedMenu extends Menu {
  active?: boolean
  activeDropdown?: boolean
  subMenu?: FormattedMenu[]
}

// Setup side menu
const findActiveMenu = (subMenu: Menu[], location: Location): boolean => {
  let match = false
  subMenu.forEach((item) => {
    if (
      ((location.forceActiveMenu !== undefined &&
        item.pathname === location.forceActiveMenu) ||
        (location.forceActiveMenu === undefined &&
          item.pathname === location.pathname)) &&
      !item.ignore
    ) {
      match = true
    } else if (!match && item.subMenu) {
      match = findActiveMenu(item.subMenu, location)
    }
  })
  return match
}

const nestedMenu = (menu: Array<Menu | 'devider'>, location: Location) => {
  const formattedMenu: Array<FormattedMenu | 'devider'> = []
  menu.forEach((item) => {
    if (typeof item !== 'string') {
      const menuItem: FormattedMenu = {
        icon: item.icon,
        title: item.title,
        pathname: item.pathname,
        subMenu: item.subMenu,
        ignore: item.ignore,
      }
      menuItem.active =
        ((location.forceActiveMenu !== undefined &&
          menuItem.pathname === location.forceActiveMenu) ||
          (location.forceActiveMenu === undefined &&
            menuItem.pathname === location.pathname) ||
          (menuItem.subMenu && findActiveMenu(menuItem.subMenu, location))) &&
        !menuItem.ignore

      if (menuItem.subMenu) {
        menuItem.activeDropdown = findActiveMenu(menuItem.subMenu, location)

        // Nested menu
        const subMenu: Array<FormattedMenu> = []
        nestedMenu(menuItem.subMenu, location).map(
          (menu) => typeof menu !== 'string' && subMenu.push(menu)
        )
        menuItem.subMenu = subMenu
      }

      formattedMenu.push(menuItem)
    } else {
      formattedMenu.push(item)
    }
  })

  return formattedMenu
}

const linkTo = (menu: FormattedMenu, navigate: NavigateFunction) => {
  if (menu.subMenu) {
    menu.activeDropdown = !menu.activeDropdown
  } else {
    if (menu.pathname !== undefined) {
      navigate(menu.pathname)
    }
  }
}

const enter = (el: HTMLElement) => {
  slideDown(el, 300)
}

const leave = (el: HTMLElement) => {
  slideUp(el, 300)
}

export { nestedMenu, linkTo, enter, leave }
