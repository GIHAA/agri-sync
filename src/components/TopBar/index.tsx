/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable import/extensions */
import { useState } from 'react'
import _, { truncate } from 'lodash'
import { Link, useLocation } from 'react-router-dom'
import Lucide from '../../components/common/lucide'
import Breadcrumb from '../../base-components/Breadcrumb'
import { FormInput } from '../common/form-elements/components'
import { Menu, Popover } from '../common/headless'
import PreviewImage from '../../../src/assets/images/tip-app-logo.png'
import SocketClient from '../../hooks/SocketClient'
import { useGetNotificationsList } from '../../api/notification'
import NoDataFound from '../../assets/images/NoDataFound.png'

// function getCurrentDate() {
//   const currentDate = new Date()
//   const day = currentDate.getDate()
//   const month = currentDate.getMonth() + 1
//   const year = currentDate.getFullYear()
//   return `${day}/${month}/${year}`
// }

// Define the breadcrumb map with specific types
const breadcrumbMap: { [key: string]: string } = {
  '/tip-setting': 'Tip Settings',
  '/manage-users': 'Admin User Management',
  '/manage-user-roles': 'Admin Role Management',
  '/manage-tippers': 'Tipper Management',
  '/manage-service-providers': 'Service Provider Management',
  '/manage-finances': 'Tip Management',
  '/manage-reviews': 'Review Management',
  '/gateway-setting': 'Gateway Settings',
  '/footer-management': 'Footer Management',
  '/annoucements': 'Annoucements',
  '/reports': 'Reports',
  '/newsletter-management': 'Newsletter Management',
  '/manage-faqs': 'FAQs',
  '/manage-faq-categories': 'FAQ Categories',
}

function Main() {
  const [searchDropdown, setSearchDropdown] = useState(false)

  const { pathname } = useLocation()

  // Type assertion for pathname to ensure it's a valid key
  const breadcrumbLabel =
    breadcrumbMap[pathname as keyof typeof breadcrumbMap] || 'Home'

  const showSearchDropdown = () => {
    setSearchDropdown(true)
  }
  const hideSearchDropdown = () => {
    setSearchDropdown(false)
  }

  let user = JSON.parse(localStorage.getItem('user') || '{}')
  console.log(user)
  const { data } = useGetNotificationsList()

  return (
    <>
      {/* BEGIN: Top Bar */}
      <div className="relative z-[51] flex h-[67px] items-center border-b border-slate-200">
        <SocketClient email={user.Email} role={user.Role} />
        {/* BEGIN: Breadcrumb */}
        <Breadcrumb className="-intro-x mr-auto hidden sm:flex">
          <Breadcrumb.Link to="/">TipApp</Breadcrumb.Link>
          <Breadcrumb.Link to={pathname} active>
            {breadcrumbLabel}
          </Breadcrumb.Link>
        </Breadcrumb>
        {/* <Menu>
          <Menu.Button>
            <Button
              size="sm"
              variant="twitter"
              className="relative mr-2 w-20 justify-start rounded-full"
            >
              POS
              <span className="absolute bottom-0 right-0 top-0 my-auto ml-auto mr-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-primary">
                <Lucide icon="Airplay" className="h-4 w-4" />
              </span>
            </Button>
          </Menu.Button>

          <Menu.Items className="w-36">
            <a href="/pos">
              <Menu.Item>
                <Lucide icon="Monitor" className="mr-2 h-4 w-4 " /> POS
              </Menu.Item>
            </a>
            <Menu.Item>
              <Link className="flex" to="/pos">
                <Lucide icon="Tv2" className="mr-2 mt-0.5 h-4 w-4" /> SM POS
              </Link>
            </Menu.Item>
          </Menu.Items>
        </Menu> */}
        {/* <Tippy
          as="a"
          href="https://projects.storemate.lk/customer"
          className="zoom-in mr-2 flex h-8 w-8 items-center justify-center rounded-full border bg-primary bg-opacity-90 text-white dark:border-darkmode-400"
          content="Support"
        >
          <Lucide icon="Headphones" className="h-4 w-4 " />
        </Tippy> */}

        {/* <Tippy
          as="a"
          href="/pos"
          className="zoom-in mr-2 flex h-8 w-8 items-center justify-center rounded-full border bg-danger bg-opacity-60 text-white dark:border-darkmode-400"
          content="Add Repair"
        >
          <Lucide icon="Wrench" className="h-4 w-4 " />
        </Tippy> */}
        {/* <Button
              size='sm'
              variant="twitter"
              className="relative justify-start mr-2 w-24 rounded-full"
            >
              Support   
              <span className="w-6 h-6 absolute flex justify-center items-center bg-white text-primary rounded-full right-0 top-0 bottom-0 my-auto ml-auto mr-0.5">
                <Lucide icon="Headphones" className="w-4 h-4" />
              </span>
            </Button> */}

        <div className="intro-x relative mr-3  ">
          <div className="relative hidden sm:block"></div>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <Popover className="intro-x mr-4 sm:mr-2">
            <Popover.Button
              className=" 
              zoom-in relative
              block items-center before:absolute before:right-0 before:top-[-2px] before:h-[8px] before:w-[8px] before:rounded-full
              before:bg-danger  before:content-['']   "
            >
              <Lucide icon="Bell" className=" h-5 w-5  " />
            </Popover.Button>
            <Popover.Panel className="mt-2 w-[280px] p-5 sm:w-[350px]">
              <div className="mb-5 font-medium">Notifications</div>
              <div className="h-64 overflow-y-auto">
                {data?.items.map((item) => (
                  <div
                    key={item.NotificationID}
                    className="mb-2 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.TipperProfilePictureUrl || PreviewImage}
                        alt="profile"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div className="ml-2">
                        <div className="text-sm">{item.Title}</div>
                        <div
                          className="text-xs text-gray-500"
                          dangerouslySetInnerHTML={{
                            __html: item.Message || '',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Popover.Panel>
          </Popover>
          <Menu>
            <Menu.Button className="image-fit zoom-in intro-x block h-8 w-8 scale-110 overflow-hidden rounded-full shadow-lg">
              <img
                alt="Midone Tailwind HTML Admin Template"
                src={user?.ProfilePictureURL || PreviewImage}
              />
            </Menu.Button>
            <Menu.Items className="relative mt-px w-56  before:absolute before:inset-0 before:z-[-1] before:block before:rounded-md before:bg-black ">
              <Menu.Header className="font-normal">
                <div className="font-medium">
                  {user.FirstName + ' ' + user.LastName}{' '}
                </div>
                <div className="/70 mt-0.5 text-xs dark:text-slate-500 break-before-auto">
                  {truncate(user.Email)}
                </div>
              </Menu.Header>
              <Menu.Devider />
              <Link
                className="flex hover:rounded-md hover:bg-primary/10 "
                to="/login"
              >
                <Menu.Item>
                  <Lucide icon="ToggleRight" className="mr-2 h-4 w-4 " /> Logout
                </Menu.Item>
              </Link>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </>
  )
}

export default Main
