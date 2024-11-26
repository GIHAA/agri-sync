import React, { useState } from 'react'
import Table from '../common/table'
import SlideoverRegistry from '../../pages/user-management/slideover-registry'
import Label from '../common/label/active-banned-new-label'
import Lucide from '../common/lucide'
import { UserRoles } from '../../types/adminUserTypes'
import { truncate } from 'lodash'
import permissionChecker from '../../hooks/permissonChecker'
import ConfirmationModal from '../common/confirmation/ConfirmationModal'

interface RoleManagementTableProps {
  headers: { key: number; label: string }[]
  Items: UserRoles[]
  handleViewOnClick: (userId: number) => void
  handleEditOnClick: (userId: number) => void
  handleDeleteOnClick: (userId: string) => void
}

const RoleManagementTable: React.FC<RoleManagementTableProps> = ({
  headers,
  Items,
  handleViewOnClick,
  handleEditOnClick,
  handleDeleteOnClick,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)

  function handleDelete(roleId: string) {
    setSelectedRoleId(roleId)
    setIsModalOpen(true)
  }

  function confirmDelete() {
    if (selectedRoleId) {
      handleDeleteOnClick(selectedRoleId)
    }
    setIsModalOpen(false)
  }

  function cancelDelete() {
    setSelectedRoleId(null)
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
                  header.label === 'ACTIONS'
                    ? 'w-[40px] text-center'
                    : header.key === 3
                    ? 'text-center'
                    : ''
                }`}
              >
                {header.label}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {Items.map((item) => (
            <Table.Tr
              className="intro-x  h-[68px] drop-shadow-lg"
              key={item.id}
            >
              <Table.Td className="border-b-0 bg-white shadow-[20px_3px_20px_#0000000b] first:rounded-l-md last:rounded-r-md dark:bg-darkmode-600">
                {item.name}
              </Table.Td>
              <Table.Td className="border-b-0 bg-white shadow-[20px_3px_20px_#0000000b] first:rounded-l-md last:rounded-r-md dark:bg-darkmode-600">
                {item.userCount}
              </Table.Td>
              <Table.Td className="cursor-pointer justify-end border-b-0 bg-white shadow-[20px_3px_20px_#0000000b] first:rounded-l-md last:rounded-r-md dark:bg-darkmode-600">
                <div className="mr-3 flex justify-end gap-3">
                  <Lucide
                    icon="Eye"
                    className="h-6 w-6 text-black"
                    onClick={() => handleViewOnClick(item.id)}
                  />
                  {permissionChecker(
                    <Lucide
                      icon="Edit"
                      className="h-6 w-6 text-black"
                      onClick={() => handleEditOnClick(item.id)}
                    />,
                    'role_management.edit'
                  )}
                  {permissionChecker(
                    <Lucide
                      icon="Trash2"
                      className="h-6 w-6 text-red-500"
                      onClick={() => handleDelete(item.id.toString())}
                    />,
                    'role_management.delete'
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
        message="Are you sure you want to delete this role?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
}

export default RoleManagementTable
