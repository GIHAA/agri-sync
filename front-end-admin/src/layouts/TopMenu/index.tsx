/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable eqeqeq */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable prettier/prettier */
import { useState, useEffect, Fragment } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { selectTopMenu } from "../../stores/topMenuSlice"
import { useAppSelector } from "../../stores/hooks"
import _ from "lodash"
import { FormattedMenu, linkTo, nestedMenu } from "./top-menu"
import Lucide from "../../components/common/lucide"
import Breadcrumb from "../../base-components/Breadcrumb"
import { FormInput } from "../../components/common/form-elements/components"
import { Menu, Popover } from "../../components/common/headless"
import clsx from "clsx"

function Main() {
  const [searchDropdown, setSearchDropdown] = useState(false);
  const showSearchDropdown = () => {
    setSearchDropdown(true);
  };
  const hideSearchDropdown = () => {
    setSearchDropdown(false);
  };
  const location = useLocation();
  const [formattedMenu, setFormattedMenu] = useState<Array<FormattedMenu>>([]);
  const topMenuStore = useAppSelector(selectTopMenu);
  const topMenu = () => nestedMenu(topMenuStore, location);

  useEffect(() => {
    setFormattedMenu(topMenu());
  }, [topMenuStore, location.pathname]);

  return (
    <div className="py-2">
      {/* BEGIN: Top Bar */}
      <div className="border-b border-white/[0.08] mt-[2.2rem] md:-mt-5 -mx-3 sm:-mx-8 px-3 sm:px-8 pt-3 md:pt-0 mb-10">
        <div className="flex items-center h-[70px] z-[51] relative">
          {/* BEGIN: Logo */}
          <Link
            to="/top-menu/dashboard-overview-1"
            className="hidden -intro-x md:flex"
          >
      
            <span className="ml-3 text-lg text-white"> Rubick </span>
          </Link>
          {/* END: Logo */}
          {/* BEGIN: Breadcrumb */}
          <Breadcrumb
            light
            className="h-full md:ml-10 md:pl-10 md:border-l border-white/[0.08] mr-auto -intro-x"
          >
            <Breadcrumb.Link to="/">Application</Breadcrumb.Link>
            <Breadcrumb.Link to="/" active={true}>
              Dashboard
            </Breadcrumb.Link>
          </Breadcrumb>
          {/* END: Breadcrumb */}
          {/* BEGIN: Search */}
          <div className="relative mr-3 intro-x sm:mr-6">
            <div className="hidden sm:block">
              <FormInput
                type="text"
                className="border-transparent w-56 shadow-none rounded-full bg-slate-200 pr-8 transition-[width] duration-300 ease-in-out focus:border-transparent focus:w-72 dark:bg-darkmode-400/70"
                placeholder="Search..."
                onFocus={showSearchDropdown}
                onBlur={hideSearchDropdown}
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-5 h-5 my-auto mr-3 text-slate-600 dark:text-slate-500"
              />
            </div>
            <a className="relative text-white/70 sm:hidden" href="">
              <Lucide icon="Search" className="w-5 h-5 dark:text-slate-500" />
            </a>
            
          </div>
        </div>
      </div>
      {/* END: Top Bar */}
      {/* BEGIN: Top Menu */}
      <Popover className="intro-x mr-4 sm:mr-2">
            <Popover.Button
              className=" 
              zoom-in relative
              block items-center before:absolute before:right-0 before:top-[-2px] before:h-[8px] before:w-[8px] before:rounded-full
              before:bg-danger  before:content-['']   "
            >
              <Lucide icon="Bell" className=" h-5 w-5 dark:text-slate-500 " />
            </Popover.Button>
            <Popover.Panel className="mt-2 w-[280px] p-5 sm:w-[350px]">
              <div className="mb-5 font-medium">Notifications</div>
              <div className="ml-2 overflow-hidden">
                <div className="mt-0.5 w-full truncate text-slate-500" />
              </div>
            </Popover.Panel>
          </Popover>
          <p className="whitespace-nowrap border-b-0 font-medium">
            J.K.L Attanayaka
          </p>
          <Menu>
            <Menu.Button className="image-fit zoom-in intro-x block h-8 w-8 scale-110 overflow-hidden rounded-full shadow-lg">
              {/* <img
                alt="Midone Tailwind HTML Admin Template"
                src={PreviewImage}
              /> */}
            </Menu.Button>
            <Menu.Items className="relative mt-px w-56  before:absolute before:inset-0 before:z-[-1] before:block before:rounded-md before:bg-black ">
              <Menu.Header className="font-normal">
                <div className="font-medium">J.K.L Attanayake</div>
                <div className="/70 mt-0.5 text-xs dark:text-slate-500">
                  Parallax (PVT) LTD
                </div>
              </Menu.Header>
              <Menu.Devider />
              <Menu.Item className="hover:bg-white/5">
                <Lucide icon="User" className="mr-2 h-4 w-4" /> Profile
              </Menu.Item>
              <Menu.Item className="hover:bg-white/5">
                <Lucide icon="HelpCircle" className="mr-2 h-4 w-4" /> Help
              </Menu.Item>
              <Menu.Devider />
              <Menu.Item className="hover:bg-white/5">
                <Lucide icon="ToggleRight" className="mr-2 h-4 w-4" /> Logout
              </Menu.Item>
            </Menu.Items>
          </Menu>
               {/* BEGIN: Top Menu */}
      <nav className="relative z-50 hidden md:block">
        <ul className="pb-3 xl:pb-0 xl:px-[50px] flex flex-wrap">
          {formattedMenu.map((menu, menuKey) => (
            <li
              className={clsx([
                "relative [&:hover>ul]:block [&:hover>a>div:nth-child(2)>svg]:-rotate-90",
                !menu.active &&
                  "[&:hover>a>div:nth-child(1)]:before:bg-white/5 [&:hover>a>div:nth-child(1)]:before:dark:bg-darkmode-500/70",
              ])}
              key={menuKey}
            >
              <MenuLink menu={menu} level="first"></MenuLink>
              {/* BEGIN: Second Child */}
              {menu.subMenu && (
                <ul className="xl:left-[100%] xl:-ml-[4px] shadow-[0px_3px_20px_#0000000b] bg-primary hidden w-56 absolute rounded-md z-20 px-0 top-0 mt-14 xl:-mt-5 before:block before:absolute before:w-full before:h-full before:bg-black/10 before:inset-0 before:rounded-md before:z-[-1] dark:bg-darkmode-600 dark:shadow-[0px_3px_7px_#0000001c]">
                  {menu.subMenu.map((subMenu, subMenuKey) => (
                    <li
                      className="px-5 relative [&:hover>ul]:block [&:hover>a>div:nth-child(2)>svg]:-rotate-90"
                      key={subMenuKey}
                    >
                      <MenuLink menu={subMenu} level="second"></MenuLink>
                      {/* BEGIN: Third Child */}
                      {subMenu.subMenu && (
                        <ul
                          className={clsx([
                            "left-[100%] ml-0 shadow-[0px_3px_20px_#0000000b] bg-primary hidden w-56 absolute rounded-md z-20 px-0 top-0 mt-0 before:block before:absolute before:w-full before:h-full before:bg-black/10 before:inset-0 before:rounded-md before:z-[-1] dark:bg-darkmode-600 dark:shadow-[0px_3px_7px_#0000001c]",
                          ])}
                        >
                          {subMenu.subMenu.map(
                            (lastSubMenu, lastSubMenuKey) => (
                              <li
                                className="px-5 relative [&:hover>ul]:block [&:hover>a>div:nth-child(2)>svg]:-rotate-90"
                                key={lastSubMenuKey}
                              >
                                <MenuLink
                                  menu={lastSubMenu}
                                  level="third"
                                ></MenuLink>
                              </li>
                            )
                          )}
                        </ul>
                      )}
                      {/* END: Third Child */}
                    </li>
                  ))}
                </ul>
              )}
              {/* END: Second Child */}
            </li>
          ))}
        </ul>
      </nav>
      {/* END: Top Menu */}
      <div className="rounded-[30px] min-w-0 min-h-screen flex-1 pb-10 bg-slate-100 dark:bg-darkmode-700 px-4 md:px-[22px] max-w-full md:max-w-auto before:content-[''] before:w-full before:h-px before:block">
        <Outlet />
      </div>
      {/* END: Content */}
    </div>
  );
}
function MenuLink(props: {
  menu: FormattedMenu;
  level: "first" | "second" | "third";
}) {
  const navigate = useNavigate();
  return (
    <a
      href={props.menu.subMenu ? "#" : props.menu.pathname}
      className={clsx([
        "h-[55px] rounded-full xl:rounded-b-none xl:rounded-t-[1rem] flex items-center text-white relative",
        props.level == "first" && "px-5 mr-1",
        props.level != "first" && "px-0 mr-0",
        props.level == "first" &&
          props.menu.active &&
          "bg-slate-100 dark:bg-darkmode-700",
        props.level == "first" &&
          props.menu.active &&
          "before:content-[''] before:w-[20px] before:h-[20px] before:-ml-[20px] before:rotate-90 before:scale-[1.04] before:bg-[length:100%] before:bg-menu-corner before:absolute before:bottom-0 before:left-0 before:hidden before:xl:block dark:before:bg-menu-corner-dark",
        props.level == "first" &&
          props.menu.active &&
          "after:content-[''] after:w-[20px] after:h-[20px] after:-mr-[20px] after:rotate-180 after:scale-[1.04] after:bg-[length:100%] after:bg-menu-corner after:absolute after:bottom-0 after:right-0 after:hidden after:xl:block dark:after:bg-menu-corner-dark",
      ])}
      onClick={(event) => {
        event.preventDefault();
        linkTo(props.menu, navigate);
      }}
    >
      <div
        className={clsx([
          "dark:text-slate-400",
          props.level == "first" &&
            props.menu.active &&
            "text-primary dark:text-white",
          !props.menu.active &&
            "before:content-[''] before:z-[-1] before:absolute before:w-full before:h-full before:top-0 before:left-0 before:rounded-full xl:before:rounded-b-none xl:before:rounded-t-lg before:transition before:ease-in before:duration-100",
        ])}
      >
        <Lucide icon={props.menu.icon} />
      </div>
      <div
        className={clsx([
          "ml-3 flex items-center whitespace-nowrap dark:text-slate-400",
          props.level == "first" &&
            props.menu.active &&
            "text-black font-medium dark:text-white",
          props.level != "first" && "w-full",
        ])}
      >
        {props.menu.title}
        {props.menu.subMenu && (
          <Lucide
            icon="ChevronDown"
            className={clsx([
              "hidden w-4 h-4 ml-2 transition duration-100 ease-in xl:block",
              props.level != "first" && "ml-auto",
            ])}
          />
        )}
      </div>
    </a>
  );
}


export default Main;
