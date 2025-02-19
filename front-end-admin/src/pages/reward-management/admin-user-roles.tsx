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
import { AdminRolesTableHeadings } from '../../constants/table-data'
import { useDeleteUser } from '../../api/admin-user-management'
import Toast from '../../utils/notification'
import { Icons, NotificationTypes } from '../../constants'
import RoleManagementTable from '../../components/table/admin-role-management-table'
import ViewRoleSection from './components/roleManagement/viewRoleSection'
import AddRoleSection from './components/roleManagement/addRoleSection'
import EditRoleSection from './components/roleManagement/editRoleSection'
import {
  useDeleteRole,
  useGetRoles,
} from '../../api/admin-role-management'
import permissionChecker from '../../hooks/permissonChecker'
import NoDataFound from '../../assets/images/NoDataFound.png'

interface FormContent {
  title: string
  component: (props: { roleId: string }) => ReactElement
}

const AdminRoleManagementPage = () => {
  const { handleSlider } = SharedDataContainer.useContainer()
  const [searchName, setSearchName] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [query, setQuery] = useState<string>('')
  const { data, isSuccess, isLoading, isError, error } = useGetRoles(
    query,
    currentPage,
    pageSize
  )
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

  let typingTimeout: NodeJS.Timeout

  const handleViewRoleOnClick = (roleId: number) => {
    handleSlider()
    setSliderContent({
      header: 'View Role Details',
      children: <ViewRoleSection roleId={roleId} />,
      footer: <div />,
    })
    setSliderSize('xl')
  }

  const handleAddRoleOnClick = () => {
    handleSlider()
    setSliderContent({
      header: 'Add Role Details',
      children: <AddRoleSection />,
      footer: <div />,
    })
    setSliderSize('xl')
  }

  const handleEditRoleOnClick = (roleId: number) => {
    handleSlider()
    setSliderContent({
      header: 'Edit Role Details',
      children: <EditRoleSection roleId={roleId} />,
      footer: <div />,
    })
    setSliderSize('xl')
  }

  const { setNotification } = SharedDataContainer.useContainer()

  const {
    mutate: deleteRole,
    isSuccess: deleteSuccess,
    isError: deleteError,
  } = useDeleteRole()

  useEffect(() => {
    if (deleteSuccess) {
      setNotification({
        message: 'Role deleted successfully',
        icon: Icons.CHECKCIRCLE,
        type: NotificationTypes.SUCCESS,
      })
      Toast()
    }
  }, [deleteSuccess])

  useEffect(() => {
    if (deleteError) {
      setNotification({
        message: 'Role deletion failed',
        icon: Icons.CLOSE,
        type: NotificationTypes.ERROR,
      })
      Toast()
    }
  }, [deleteError])

  const handleDeleteRoleOnClick = async (roleId: string) => {
    deleteRole(roleId)
  }

  const searchRoleData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchName(value)

    if (typingTimeout) clearTimeout(typingTimeout)

    typingTimeout = setTimeout(() => {
      setQuery(value)
    }, 750)
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1)
  }

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPageSize(Number(event.target.value))
    setCurrentPage(1)
  }

  const totalPages = data?.data?.meta?.totalPages ?? 0

  return (
    <div className="col-span-12 mt-6">
      <div className="intro-y mb-8 flex h-10 items-center justify-between sm:flex ">
        <h2 className="mr-5 truncate text-[19px] text-lg font-medium  text-[#2D3748]">
        Admin Role Management
        </h2>
        {permissionChecker(
          <Button
            onClick={() => {
              handleAddRoleOnClick()
            }}
            className="primary flex  min-w-[100px] items-center gap-2.5 bg-black !font-medium text-white"
          >
            Add Role
          </Button>,
          'role_management.add'
        )}
      </div>
      <div className="mb-8 mt-3 flex items-center justify-between sm:ml-auto sm:mt-0 ">
        <div className="relative flex sm:mt-0 sm:w-auto">
          <FormInput
            type="text"
            className="box custom-input w-40 sm:w-64"
            placeholder="Search..."
            onChange={searchRoleData}
          />
          <Lucide
            icon="Search"
            className="absolute inset-y-0 right-0 my-auto mr-2 h-5 w-8 text-[#B2BEB5]"
          />
        </div>

    
      </div>
      <div className="intro-y mt-8 overflow-auto sm:mt-0 lg:overflow-visible">
        {isLoading ? (
          <p>Loading...</p>
        ) : isSuccess && data.data?.items.length ? (
          <RoleManagementTable
            Items={data.data.items}
            handleViewOnClick={handleViewRoleOnClick}
            handleEditOnClick={handleEditRoleOnClick}
            handleDeleteOnClick={handleDeleteRoleOnClick}
            headers={AdminRolesTableHeadings}
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

export default AdminRoleManagementPage
