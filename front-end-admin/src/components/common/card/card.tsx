import React from 'react'
import DashboardTile from '../../dashboard/dashboard-tiles'
import DashboardTileSeconary from '../../dashboard/dashboard-tiles-secondary'

interface AgrisyncCardProps {
  title: string
  amount?: number

  icon?: string
}

const AgrisyncCard: React.FC<AgrisyncCardProps> = ({
  title,
  amount,

  icon,
}) => {
  return (
    <div>
      <DashboardTileSeconary
        amount={amount ? Number(amount).toFixed(2).toLocaleString() : '0.00'}
        label={title}
        toolagrisyncText="Higher than last month"
        icon={icon}
      />
    </div>
  )
}

export default AgrisyncCard
