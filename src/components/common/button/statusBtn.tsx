import React from 'react'
import Label from '../label/active-banned-new-label'

interface StatusButtonProps {
  status: any
}

const StatusButton: React.FC<StatusButtonProps> = ({ status }) => {
  let labelData = ''
  let additionalStyle = ''

  const baseStyle = 'max-w-[115px] min-w-[115px] text-white text-center rounded'

  switch (status) {
    case false:
    case 'active':
      labelData = 'Active'
      additionalStyle = 'bg-[#03C50B]'
      break
    case 'sent':
      labelData = 'Received'
      additionalStyle = 'bg-[#03C50B]'
      break
    case true:
    case 'inactive':
    case 'banned':
      labelData = 'Inactive'
      additionalStyle = 'bg-[#D70000]'
      break
    case 'rejected':
      labelData = 'Rejected'
      additionalStyle = 'bg-[#D70000]'
      break
    case 'new':
      labelData = 'Active'
      additionalStyle = 'bg-[#03C50B]'
      break
    case 'in-progress':
      labelData = 'In Progress'
      additionalStyle = 'bg-yellow-400'
      break
    default:
      labelData = 'Pending..'
      additionalStyle = 'bg-[#808080]'
      break
  }

  const labelStyle = `${baseStyle} ${additionalStyle}`

  return <Label labledata={labelData} lablestyle={labelStyle} />
}

export default StatusButton
