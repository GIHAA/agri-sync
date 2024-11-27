/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable radix */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable prettier/prettier */
/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-destructuring */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */

import React, { ReactElement, useEffect, useState } from 'react'
import Button from '../../components/common/button'
import {
  FormInput,
  FormSelect,
} from '../../components/common/form-elements/components'
import Lucide from '../../components/common/lucide'
import FilterIcon from '../../assets/images/icons/filter-icon.svg'
import SharedDataContainer from '../../containers/sharedData'
import SlideoverPanel from '../../components/slideover-panel'
import Pagination from '../../components/pagination/pagination'
import { AdminUserTableHeadings } from '../../constants/table-data'
import AdminManagementTable from '../../components/table/admin-user-management-table'
import AddUserSection from './components/userManagement/addUserSection'
import ViewUserSection from './components/userManagement/viewUserSection'
import EditUserSection from './components/userManagement/editUserSection'
import {
  useDeleteUser,
  useGetUserDetails,
} from '../../api/admin-user-management'
import Toast from '../../utils/notification'
import { Icons, NotificationTypes } from '../../constants'
import { useGetAllRoles } from '../../api/admin-role-management'
import permissionChecker from '../../hooks/permissonChecker'
import SelectElement from '../../components/common/form-elements/select-element-secondary'
import { AlignmentTypes } from '../../constants/common-enums'
import NoDataFound from '../../assets/images/NoDataFound.png'

interface FormContent {
  title: string
  component: (props: { userId: string }) => ReactElement
}

const AdminUserManagementPage = () => {
  const { handleSlider } = SharedDataContainer.useContainer()
  const [searchName, setSearchName] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [query, setQuery] = useState<string>('')
  const [role, setRole] = useState<number>()
  const [status, setStatus] = useState<string>('')
  const { data, refetch, isSuccess, isLoading, isError, error } =
    useGetUserDetails(query, 'staff', role ?? 0, status, currentPage, pageSize)
  const { data: roles } = useGetAllRoles()
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [sliderSize, setSliderSize] = useState<string>('xl')
  const [sliderContent, setSliderContent] = useState<{
    header: string
    children: ReactElement
    footer: ReactElement
  }>({
    header: '',
    children: <div />,
    footer: <div />,
  })
  const [refresh, setRefresh] = useState<boolean>(false)

  let typingTimeout: NodeJS.Timeout

  const handleViewUserOnClick = (userId: string) => {
    handleSlider()
    setSliderContent({
      header: 'View User Details',
      children: <ViewUserSection userId={userId} />,
      footer: <div />,
    })
    setSliderSize('xl')
  }

  const handleAddUserOnClick = () => {
    handleSlider()
    setSliderContent({
      header: 'Add User Details',
      children: <AddUserSection roles={roles} />,
      footer: <div />,
    })
    setSliderSize('xl')
  }

  const handleEditUserOnClick = (userId: string) => {
    handleSlider()
    setSliderContent({
      header: 'Edit User Details',
      children: <EditUserSection roles={roles} userId={userId} />,
      footer: <div />,
    })
    setSliderSize('xl')
  }

  const { setNotification } = SharedDataContainer.useContainer()

  const {
    mutate: deleteUser,
    isSuccess: deleteSuccess,
    isError: deleteError,
  } = useDeleteUser()

  useEffect(() => {
    if (deleteSuccess) {
      setNotification({
        message: 'User deleted successfully',
        icon: Icons.CHECKCIRCLE,
        type: NotificationTypes.SUCCESS,
      })
      Toast()
    }
  }, [deleteSuccess])

  useEffect(() => {
    if (deleteError) {
      setNotification({
        message: 'User deletion failed',
        icon: Icons.CLOSE,
        type: NotificationTypes.ERROR,
      })
      Toast()
    }
  }, [deleteError])

  const handleDeleteUserOnClick = async (userId: string) => {
    deleteUser(userId)
  }

  const searchUserData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchName(value)

    if (typingTimeout) clearTimeout(typingTimeout)

    typingTimeout = setTimeout(() => {
      setQuery(value)
    }, 750)
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
    setRefresh(!refresh)
  }

  useEffect(() => {
    refetch()
  }, [refresh])

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1)
  }

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPageSize(Number(event.target.value))
    setCurrentPage(1)
  }
  const formatedRoles = Array.isArray(roles)
    ? roles.map((role: { name: string; id: number }, key) => ({
        id: key,
        value: role.id.toString(),
        name: role.name,
      }))
    : []

  const totalPages = data?.data?.meta?.totalPages ?? 0
  const [Prefixtype] = useState([
    { id: 0, name: 'All', value: '' },
    { id: 1, name: 'Active', value: 'active' },
    { id: 2, name: 'Inactive', value: 'banned' },
  ])

  return (
    <div className="col-span-12 mt-6">
      <div className="intro-y mb-8 flex h-10 items-center justify-between sm:flex">
        <h2 className="mr-5 truncate text-[19px] text-lg font-medium  text-[#2D3748]">
          Admin User Management
        </h2>
        {permissionChecker(
          <Button
            onClick={() => {
              handleAddUserOnClick()
            }}
            className="primary min-w-[100px] flex items-center gap-2.5 bg-black !font-medium text-white"
          >
            Add User
          </Button>,
          'user_management.add'
        )}
      </div>
      <div className="mb-8 mt-3 flex items-center justify-between sm:ml-auto sm:mt-0 ">
        <div className="relative flex sm:mt-0 sm:w-auto">
          <FormInput
            type="text"
            className="box custom-input w-40 sm:w-64"
            placeholder="Search..."
            onChange={searchUserData}
          />
          <Lucide
            icon="Search"
            className="absolute inset-y-0 right-0 my-auto mr-2 h-5 w-8 text-[#B2BEB5]"
          />
        </div>

        <div className="relative">
          <Button
            className="!box flex items-center gap-2.5 !font-medium text-black dark:text-slate-300"
            onClick={toggleFilters}
          >
            <img src={FilterIcon} alt="Filter Icon" />
            <span className="hidden sm:block">Filters</span>
          </Button>

          {showFilters && (
            <div className="absolute right-0 top-full z-20 mt-2 w-80 rounded-lg bg-white p-4 shadow-lg">
              <div className="">
                <SelectElement
                  id="role"
                  label="Role"
                  name="Role"
                  required={true}
                  labelAlignment={AlignmentTypes.BLOCK}
                  onChange={(e) => {
                    const id = parseInt(e.target.value)
                    setRole(id)
                  }}
                  options={formatedRoles}
                  inputClassName="!mt-0"
                />
              </div>
              <div className="mb-6 py-5">
                <SelectElement
                  label={'Status'}
                  options={Prefixtype}
                  name="gateway_type"
                  id="gateway_type"
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value.toLowerCase())
                  }}
                  inputClassName="!mt-3"
                />
              </div>

              <div className="flex justify-between">
                <button
                  className="rounded-md bg-gray-100 px-4 py-2 text-gray-500 hover:bg-gray-200"
                  onClick={() => {
                    setRole(undefined)
                    setStatus('')
                    toggleFilters()
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={toggleFilters}
                  className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="intro-y mt-8 overflow-auto sm:mt-0 lg:overflow-visible">
        {isLoading ? (
          <p>Loading...</p>
        ) : isSuccess && data.data?.items.length ? (
          <AdminManagementTable
            Items={data.data.items}
            handleViewOnClick={handleViewUserOnClick}
            handleEditOnClick={handleEditUserOnClick}
            handleDeleteOnClick={handleDeleteUserOnClick}
            headers={AdminUserTableHeadings}
          />
        ) : (
                  <div className="flex flex-col gap-3">
            {' '}
            <div className="mb-3 flex min-h-[400px] w-full flex-col items-center justify-center rounded-lg border-b-0 bg-white shadow-lg">
              {' '}
              <img src={NoDataFound} alt="No Data" className="w-1/5" />{' '}
              <span className="text-[#2D3748]">No Data found ......</span>{' '}
            </div>{' '}
          </div>
        )}
      </div>
      <div className="intro-y mt-3 flex flex-wrap items-center justify-between sm:flex-row sm:flex-nowrap">
        <div className="flex items-center gap-3.5">
          <div className="hidden sm:mr-auto sm:block">
            Rows per page
            <FormSelect
              className="w-15 dark:[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)] m-2"
              onChange={handlePageSizeChange}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </FormSelect>
          </div>
          <span className="hidden sm:block">|</span>
          <div className="mx-auto hidden text-slate-500 md:block">
            Showing {(currentPage - 1) * pageSize + 1} -{' '}
            {Math.min(
              currentPage * pageSize,
              data?.data?.meta?.totalItems ?? 0
            )}{' '}
            of {data?.data?.meta?.totalItems ?? 0}
          </div>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageClick={handlePageClick}
        />
      </div>
      <SlideoverPanel
        close
        size={sliderSize}
        heading={sliderContent.header}
        footer={sliderContent.footer}
      >
        {sliderContent.children}
      </SlideoverPanel>
    </div>
  )
}

export default AdminUserManagementPage
