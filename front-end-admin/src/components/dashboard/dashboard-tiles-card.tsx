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
          Tips Overview
        </h2>
      </div>
      <div className="mt-5 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-[39px]">
        <DashboardTile
          amount={`AED ${TipsAmount}`}
          percentage={formatTiles(
            tipsData?.dailyAverageComparisonPercentageTips || 0.00
          )}
          label="Tips Received"
          tooltipText={`${formatTiles(
            tipsData?.dailyAverageComparisonPercentageTips || 0.00
          )}% than last month`}
          tippyBgColor={getBgColor(
            tipsData?.dailyAverageComparisonPercentageTips || 0.00
          )}
          icon={TileSVG1}
        />
        <DashboardTile
          amount="AED 0.00"
          percentage="0.00"
          label="Tip Commission"
          tooltipText="than last month"
          tippyBgColor="bg-success"
          icon={TileSVG2}
        />
        <DashboardTile
          amount="AED 0.00"
          percentage="0.00"
          label="Amount Pending "
          tooltipText="than last month"
          tippyBgColor="bg-success"
          icon={TileSVG3}
        />
        <DashboardTile
          amount={`AED ${WithdrawAmount}`}
          percentage={formatTiles(
            withdrawalsData?.dailyAverageComparisonPercentageWithdrawals || 0.00
          )}
          label="Amount Received "
          tooltipText={`${formatTiles(
            withdrawalsData?.dailyAverageComparisonPercentageWithdrawals || 0.00
          )}% than last month`}
          tippyBgColor={getBgColor(
            withdrawalsData?.dailyAverageComparisonPercentageWithdrawals || 0.00
          )}
          icon={TileSVG4}
        />
      </div>
    </div>
  )
}

export default DashboardTilesCard
