import React, { useState } from 'react'
import Table from '../common/table'
import SlideoverRegistry from '../../pages/user-management/slideover-registry'
import Label from '../common/label/active-banned-new-label'
import Lucide from '../common/lucide'
import { UserDetailsItem } from '../../types/adminUserTypes'
import { truncate } from 'lodash'
import permissionChecker from '../../hooks/permissonChecker'
import StatusButton from '../common/button/statusBtn'
import ConfirmationModal from '../common/confirmation/ConfirmationModal'

interface AdminManagementTableProps {
  headers: { key: number; label: string }[]
  Items: UserDetailsItem[]
  handleViewOnClick: (userId: string) => void
  handleEditOnClick: (userId: string) => void
  handleDeleteOnClick: (userId: string) => void
}

const AdminManagementTable: React.FC<AdminManagementTableProps> = ({
  headers,
  Items,
  handleViewOnClick,
  handleEditOnClick,
  handleDeleteOnClick,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  function handleDelete(userId: string) {
    setSelectedUserId(userId)
    setIsModalOpen(true)
  }

  function confirmDelete() {
    if (selectedUserId) {
      handleDeleteOnClick(selectedUserId)
    }
    setIsModalOpen(false)
  }

  function cancelDelete() {
    setSelectedUserId(null)
    setIsModalOpen(false)
  }

  return (
    <div>
      <Table className="border-separate border-spacing-y-[10px] sm:mt-2">
        <Table.Thead variant="default">
          <Table.Tr>
            {headers.map((header) => (
              <Table.Th
                key={header.key}
                className={`whitespace-nowrap border-b-0 ${
                  header.key === 5 || header.key === 6 ? 'text-center' : ''
                }`}
              >
                {header.label}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {Items.map((item) => (
            <Table.Tr className="intro-x h-[68px] drop-shadow-lg" key={item.id}>
              <Table.Td className="border-b-0 bg-white shadow-[20px_3px_20px_#0000000b] first:rounded-l-md last:rounded-r-md dark:bg-darkmode-600">
                {item.FirstName + ' ' + item.LastName}
              </Table.Td>
              <Table.Td className="border-b-0 bg-white shadow-[20px_3px_20px_#0000000b] first:rounded-l-md last:rounded-r-md dark:bg-darkmode-600">
                {truncate(item.Email, { length: 25 }) || 'N/A'}
              </Table.Td>
              <Table.Td className="border-b-0 bg-white shadow-[20px_3px_20px_#0000000b] first:rounded-l-md last:rounded-r-md dark:bg-darkmode-600">
                {item.Phone || 'N/A'}
              </Table.Td>
              <Table.Td className="border-b-0 bg-white shadow-[20px_3px_20px_#0000000b] first:rounded-l-md last:rounded-r-md dark:bg-darkmode-600">
                {item?.role?.name || 'N/A'}
              </Table.Td>
              <Table.Td className="ml-4 border-b-0 bg-white shadow-[20px_3px_20px_#0000000b] first:rounded-l-md last:rounded-r-md">
                <div className="flex justify-center">
                  <StatusButton status={item?.Status} />
                </div>
              </Table.Td>
              <Table.Td className="cursor-pointer justify-center border-b-0 bg-white shadow-[20px_3px_20px_#0000000b] first:rounded-l-md last:rounded-r-md dark:bg-darkmode-600">
                <div className="flex justify-center gap-3">
                  <Lucide
                    icon="Eye"
                    className="h-6 w-6 text-black"
                    onClick={() => handleViewOnClick(item.id.toString())}
                  />
                  {permissionChecker(
                    <Lucide
                      icon="Edit"
                      className="h-6 w-6 text-black"
                      onClick={() => handleEditOnClick(item.id.toString())}
                    />,
                    'user_management.edit'
                  )}
                  {permissionChecker(
                    <Lucide
                      icon="Trash2"
                      className="h-6 w-6 text-red-500"
                      onClick={() => handleDelete(item.KeyCloakID.toString())}
                    />,
                    'user_management.delete'
                  )}
                </div>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this User?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
}

export default AdminManagementTable
