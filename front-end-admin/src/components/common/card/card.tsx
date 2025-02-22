import React from 'react'
import DashboardTile from '../../dashboard/dashboard-tiles'
import DashboardTileSeconary from '../../dashboard/dashboard-tiles-secondary'

interface TipCardProps {
  title: string
  amount?: number

  icon?: string
}

const TipCard: React.FC<TipCardProps> = ({
  title,
  amount,

  icon,
}) => {
  return (
    <div>
      <DashboardTileSeconary
        amount={amount ? Number(amount).toFixed(2).toLocaleString() : '0.00'}
        label={title}
        tooltipText="Higher than last month"
        icon={icon}
      />
    </div>
  )
}

export default TipCard
