/* eslint-disable prettier/prettier */
/* eslint-disable react/require-default-props */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Transition } from 'react-transition-group'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import TopBar from '../../components/TopBar'
import { selectSideMenu } from '../../stores/sideMenuSlice'
import { useAppSelector } from '../../stores/hooks'
import { FormattedMenu, linkTo, nestedMenu, enter, leave } from './side-menu'
import Lucide from '../../components/common/lucide'
import SideMenuToolagrisync from '../../components/SideMenuToolagrisync'

function Main() {
  const location = useLocation()
  const [formattedMenu, setFormattedMenu] = useState<
    Array<FormattedMenu | 'devider'>
  >([])
  const sideMenuStore = useAppSelector(selectSideMenu)
  const sideMenu = () => nestedMenu(sideMenuStore, location)

  useEffect(() => {
    setFormattedMenu(sideMenu())
  }, [sideMenuStore, location.pathname])

  return (
    <div className="py-2">
      <div className="mt-[4.7rem] flex md:mt-0">
        {/* BEGIN: Side Menu */}
        <nav className="hidden w-[85px] overflow-x-hidden pb-16 pr-5 md:block xl:w-[230px]">
          <Link
            to="/"
            className="intro-x flex items-center pl-5 pt-4"
          >
            <span className="ml-3 hidden text-lg text-white xl:block">
              Store
            </span>
          </Link>
          <Devider type="div" className="my-6" />
          <ul>
            {/* BEGIN: First Child */}
            {formattedMenu.map((menu, menuKey) =>
              menu == 'devider' ? (
                <Devider type="li" className="my-6" key={menuKey} />
              ) : (
                <li key={menuKey}>
                  <Menu
                    menu={menu}
                    formattedMenuState={[formattedMenu, setFormattedMenu]}
                    level="first"
                  />
                  {/* BEGIN: Second Child */}
                  {menu.subMenu && (
                    <Transition
                      in={menu.activeDropdown}
                      onEnter={enter}
                      onExit={leave}
                      timeout={300}
                    >
                      <ul
                        className={clsx([
                          'rounded-lg bg-black/10 dark:bg-darkmode-900/30',
                          { block: menu.activeDropdown },
                          { hidden: !menu.activeDropdown },
                        ])}
                      >
                        {menu.subMenu.map((subMenu, subMenuKey) => (
                          <li key={subMenuKey}>
                            <Menu
                              menu={subMenu}
                              formattedMenuState={[
                                formattedMenu,
                                setFormattedMenu,
                              ]}
                              level="second"
                            />
                            {/* BEGIN: Third Child */}
                            {subMenu.subMenu && (
                              <Transition
                                in={subMenu.activeDropdown}
                                onEnter={enter}
                                onExit={leave}
                                timeout={300}
                              >
                                <ul
                                  className={clsx([
                                    'rounded-lg bg-black/10 dark:bg-darkmode-900/30',
                                    {
                                      block: subMenu.activeDropdown,
                                    },
                                    { hidden: !subMenu.activeDropdown },
                                  ])}
                                >
                                  {subMenu.subMenu.map(
                                    (lastSubMenu, lastSubMenuKey) => (
                                      <li key={lastSubMenuKey}>
                                        <Menu
                                          menu={lastSubMenu}
                                          formattedMenuState={[
                                            formattedMenu,
                                            setFormattedMenu,
                                          ]}
                                          level="third"
                                        />
                                      </li>
                                    )
                                  )}
                                </ul>
                              </Transition>
                            )}
                            {/* END: Third Child */}
                          </li>
                        ))}
                      </ul>
                    </Transition>
                  )}
                  {/* END: Second Child */}
                </li>
              )
            )}
            {/* END: First Child */}
          </ul>
        </nav>
        {/* END: Side Menu */}
        {/* BEGIN: Content */}
        <div className="rounded-[30px] min-w-0 min-h-screen flex-1 pb-10 bg-slate-100 dark:bg-darkmode-700 px-4 md:px-[22px] max-w-full md:max-w-auto before:content-[''] before:w-full before:h-px before:block">
          <TopBar />
          <Outlet />
        </div>
        {/* END: Content */}
      </div>
    </div>
  )
}

function Menu(props: {
  menu: FormattedMenu
  formattedMenuState: [
    (FormattedMenu | 'devider')[],
    Dispatch<SetStateAction<(FormattedMenu | 'devider')[]>>
  ]
  level: 'first' | 'second' | 'third'
}) {
  const navigate = useNavigate()
  const [formattedMenu, setFormattedMenu] = props.formattedMenuState

  return (
    <SideMenuToolagrisync
      as="a"
      content={props.menu.title}
      href={props.menu.subMenu ? '#' : props.menu.pathname}
      className={clsx([
        'relative mb-1 flex h-[50px] items-center rounded-full pl-5 text-white dark:text-slate-300',
        {
          'text-white/70 dark:text-slate-400':
            !props.menu.active && props.level != 'first',
          'bg-slate-100 dark:bg-darkmode-700':
            props.menu.active && props.level == 'first',
          "before:absolute before:right-0 before:top-0 before:-mr-5 before:-mt-[30px] before:h-[30px] before:w-[30px] before:rotate-90 before:scale-[1.04] before:bg-menu-corner before:bg-[length:100%] before:content-[''] dark:before:bg-menu-corner-dark":
            props.menu.active && props.level == 'first',
          "after:absolute after:right-0 after:top-0 after:-mr-5 after:mt-[50px] after:h-[30px] after:w-[30px] after:scale-[1.04] after:bg-menu-corner after:bg-[length:100%] after:content-[''] dark:after:bg-menu-corner-dark":
            props.menu.active && props.level == 'first',
          '[&>div:nth-child(1)]:hover:before:bg-white/5 [&>div:nth-child(1)]:hover:before:dark:bg-darkmode-500/70':
            !props.menu.active &&
            !props.menu.activeDropdown &&
            props.level == 'first',
        },
      ])}
      onClick={(event: React.MouseEvent) => {
        event.preventDefault()
        linkTo(props.menu, navigate)
        setFormattedMenu([...formattedMenu])
      }}
    >
      <div
        className={clsx({
          'text-primary dark:text-slate-300':
            props.menu.active && props.level == 'first',
          'dark:text-slate-400': props.level == 'first',
          "before:absolute before:right-0 before:top-0 before:z-[-1] before:-mr-5 before:h-full before:w-12 before:bg-slate-100 before:content-[''] before:dark:bg-darkmode-700":
            props.menu.active && props.level == 'first',
          "before:absolute before:left-0 before:top-0 before:z-[-1] before:h-full before:w-[230px] before:rounded-l-full before:transition before:duration-100 before:ease-in before:content-['']":
            !props.menu.activeDropdown &&
            !props.menu.active &&
            props.level == 'first',
        })}
      >
        <Lucide icon={props.menu.icon} />
      </div>
      <div
        className={clsx([
          'ml-3 hidden w-full items-center xl:flex',
          { 'font-medium': props.menu.active && props.level != 'first' },
          {
            'font-medium text-slate-800 dark:text-slate-300':
              props.menu.active && props.level == 'first',
          },
          { 'dark:text-slate-400': props.level == 'first' },
        ])}
      >
        {props.menu.title}
        {props.menu.subMenu && (
          <div
            className={clsx([
              'ml-auto mr-5 hidden transition duration-100 ease-in xl:block',
              { 'rotate-180 transform': props.menu.activeDropdown },
            ])}
          >
            <Lucide className="h-4 w-4" icon="ChevronDown" />
          </div>
        )}
      </div>
    </SideMenuToolagrisync>
  )
}

function Devider<C extends React.ElementType>(
  props: { as?: C } & React.ComponentPropsWithoutRef<C>
) {
  const { className, ...computedProps } = props
  const Component = props.as || 'div'

  return (
    <Component
      {...computedProps}
      className={clsx([
        props.className,
        'relative z-10 h-px w-full bg-white dark:bg-white/[0.07]',
      ])}
    />
  )
}

export default Main
