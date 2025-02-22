import DashboardTile from './dashboard-tiles'
import {
  GetWeeklyTotalAndDifferenceTips,
  GetWeeklyTotalAndDifferenceWD,
} from '../../api/dashboard/dashboard'
import TileSVG1 from '../../assets/images/dashboard/tile1.svg'
import TileSVG2 from '../../assets/images/dashboard/tile2.svg'
import TileSVG3 from '../../assets/images/dashboard/tile3.svg'
import TileSVG4 from '../../assets/images/dashboard/tile4.svg'
import { formatAmount, formatTiles } from '../../hooks/formatter'

function DashboardTilesCard() {
  const {
    data: tipsData,
    isLoading: tipsLoading,
    error: tipsError,
  } = GetWeeklyTotalAndDifferenceTips()
  const {
    data: withdrawalsData,
    isLoading: wdLoading,
    error: wdError,
  } = GetWeeklyTotalAndDifferenceWD()

  const getBgColor = (percentage: number) => {
    return percentage >= 0 ? 'bg-success' : 'bg-danger'
  }

  const TipsAmount = formatAmount(tipsData?.totalLast7DaysTips || 0)
  const WithdrawAmount = formatAmount(
    withdrawalsData?.totalLast7DaysWithdrawals || 0
  )

  return (
    <div>
      <div className="intro-y block h-fit items-center sm:flex ">
        <h2 className="mt-[30px] w-fit text-[19px] text-lg font-medium text-[#2D3748]">
          Agri Overview
        </h2>
      </div>
      <div className="mt-5 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-[39px]">
        // in progress
      </div>
    </div>
  )
}

export default DashboardTilesCard
