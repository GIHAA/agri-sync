import React, { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import {
  GetWithdrawalsPerMonth,
  GetTipsPerMonth,
} from '../../../api/dashboard/dashboard'
import { monthNames } from '../../../constants/months'
import { formatThousands } from '../../../hooks/formatter'
import NoDataFound from '../../../assets/images/NoDataFound.png'
import Lucide from '../../common/lucide'

const TipsAndWithdrawalsChart: React.FC = () => {
  const withdrawalsQuery = GetWithdrawalsPerMonth()
  const tipsQuery = GetTipsPerMonth()

  const [withdrawalsData, setWithdrawalsData] = useState<
    { month: string; totalWithdrawal: string }[] | undefined
  >()
  const [tipsData, setTipsData] = useState<
    { month: string; totalTips: string }[] | undefined
  >()

  const [selectedType, setSelectedType] = useState('All')
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  )
  const [thisMonthTotal, setThisMonthTotal] = useState(0)
  const [lastMonthTotal, setLastMonthTotal] = useState(0)

  useEffect(() => {
    if (withdrawalsQuery.data) {
      setWithdrawalsData(withdrawalsQuery.data.totalsByMonth)
    }
    if (tipsQuery.data) {
      setTipsData(tipsQuery.data.totalsByMonth)
    }

    if (withdrawalsQuery.data && tipsQuery.data) {
      calculateTotals(
        withdrawalsQuery.data.totalsByMonth,
        tipsQuery.data.totalsByMonth,
        selectedType,
        selectedYear
      )
    }
  }, [withdrawalsQuery.data, tipsQuery.data, selectedType, selectedYear])

  const calculateTotals = (
    withdrawals: { month: string; totalWithdrawal: string }[] | undefined,
    tips: { month: string; totalTips: string }[] | undefined,
    type: string,
    year: string
  ) => {
    let thisMonthWithdrawal = 0
    let lastMonthWithdrawal = 0
    let thisMonthTips = 0
    let lastMonthTips = 0

    if (withdrawals && tips) {
      const currentDate = new Date()
      const currentMonth = (currentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')

      const lastMonthDate = new Date(
        currentDate.setMonth(currentDate.getMonth() - 1)
      )
      const lastMonth = (lastMonthDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')

      const thisMonthWithdrawalData = withdrawals.find(
        (data) => data.month === `${year}-${currentMonth}`
      )
      const thisMonthTipsData = tips.find(
        (data) => data.month === `${year}-${currentMonth}`
      )

      const lastMonthWithdrawalData = withdrawals.find(
        (data) => data.month === `${year}-${lastMonth}`
      )
      const lastMonthTipsData = tips.find(
        (data) => data.month === `${year}-${lastMonth}`
      )

      if (type === 'All') {
        thisMonthWithdrawal = parseFloat(
          thisMonthWithdrawalData?.totalWithdrawal || '0'
        )
        lastMonthWithdrawal = parseFloat(
          lastMonthWithdrawalData?.totalWithdrawal || '0'
        )

        thisMonthTips = parseFloat(thisMonthTipsData?.totalTips || '0')
        lastMonthTips = parseFloat(lastMonthTipsData?.totalTips || '0')

        setThisMonthTotal(thisMonthWithdrawal + thisMonthTips)
        setLastMonthTotal(lastMonthWithdrawal + lastMonthTips)
      } else if (type === 'Withdrawals') {
        thisMonthWithdrawal = parseFloat(
          thisMonthWithdrawalData?.totalWithdrawal || '0'
        )
        lastMonthWithdrawal = parseFloat(
          lastMonthWithdrawalData?.totalWithdrawal || '0'
        )

        setThisMonthTotal(thisMonthWithdrawal)
        setLastMonthTotal(lastMonthWithdrawal)
      } else if (type === 'Tips') {
        thisMonthTips = parseFloat(thisMonthTipsData?.totalTips || '0')
        lastMonthTips = parseFloat(lastMonthTipsData?.totalTips || '0')

        setThisMonthTotal(thisMonthTips)
        setLastMonthTotal(lastMonthTips)
      }
    }
  }

  const xAxisData = monthNames

  const withdrawalsYAxisData = xAxisData.map((month, index) => {
    const monthString = (index + 1).toString().padStart(2, '0')
    return (
      withdrawalsData?.find(
        (data) => data.month === `${selectedYear}-${monthString}`
      )?.totalWithdrawal || 0
    )
  })

  const tipsYAxisData = xAxisData.map((month, index) => {
    const monthString = (index + 1).toString().padStart(2, '0')
    return (
      tipsData?.find((data) => data.month === `${selectedYear}-${monthString}`)
        ?.totalTips || 0
    )
  })

  const yearOptions = Array.from({ length: 4 }, (_, i) => {
    const year = new Date().getFullYear() - i
    return (
      <option key={year} value={year.toString()}>
        {year}/01 to {year}/12
      </option>
    )
  })

  let seriesData: {
    name: string
    type: string
    data: (string | 0)[]
    smooth: boolean
    lineStyle: { color: string; width: number; type: string }
    itemStyle: { color: string; borderWidth: number }
  }[] = []

  if (selectedType === 'All') {
    seriesData = [
      {
        name: 'Withdrawals',
        type: 'line',
        data: withdrawalsYAxisData,
        smooth: true,
        lineStyle: {
          color: '#06768d',
          width: 3,
          type: 'solid',
        },
        itemStyle: {
          color: '#06768d',
          borderWidth: 3,
        },
      },
      {
        name: 'Tips',
        type: 'line',
        data: tipsYAxisData,
        smooth: true,
        lineStyle: {
          color: '#010048',
          width: 3,
          type: 'solid',
        },
        itemStyle: {
          color: '#010048',
          borderWidth: 3,
        },
      },
    ]
  } else if (selectedType === 'Withdrawals') {
    seriesData = [
      {
        name: 'Withdrawals',
        type: 'line',
        data: withdrawalsYAxisData,
        smooth: true,
        lineStyle: {
          color: '#06768d',
          width: 3,
          type: 'solid',
        },
        itemStyle: {
          color: '#06768d',
          borderWidth: 3,
        },
      },
    ]
  } else if (selectedType === 'Tips') {
    seriesData = [
      {
        name: 'Tips',
        type: 'line',
        data: tipsYAxisData,
        smooth: true,
        lineStyle: {
          color: '#010048',
          width: 3,
          type: 'solid',
        },
        itemStyle: {
          color: '#010048',
          borderWidth: 3,
        },
      },
    ]
  }

  const option = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '30px',
      right: '30px',
      bottom: '30px',
      top: '10px',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      axisLine: {
        lineStyle: {
          color: '#C8C8C8',
        },
      },
      axisLabel: {
        fontSize: 14,
        color: '#64748b',
      },
    },
    yAxis: {
      type: 'value',
      name: '',
      nameLocation: 'center',
      nameTextStyle: {
        fontFamily: 'Ciutadella-Medium',
        fontSize: 14,
        color: '#101B33',
      },
      nameGap: 24,
      axisLine: {
        lineStyle: {
          color: '#C8C8C8',
        },
      },
      axisLabel: {
        fontSize: 14,
        color: '#64748b',
      },
      splitLine: {
        lineStyle: {
          type: 'dotted',
          color: '#EDEDED',
        },
      },
    },
    series: seriesData,
  }

  return (
    <div className="mt-[30px]">
      {(!withdrawalsData || withdrawalsData.length === 0) &&
      (!tipsData || tipsData.length === 0) ? (
        <div>
          <h2 className="mr-5 text-[19px] text-lg font-medium text-[#2D3748] sm:mt-[20px]">
            Withdrawal & Received Trend
          </h2>
          <div className="mt-[15px] flex w-full flex-col items-center justify-center rounded-xl bg-white px-4 shadow-md">
            <img
              src={NoDataFound}
              alt="No data found"
              className="max-h-[395px] min-h-[395px] w-fit object-cover"
            />
            <span className="mb-12 text-center">No Data Found...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="intro-y block h-10 items-center justify-between sm:flex">
            <h2 className="mr-5 text-[19px] text-lg font-medium text-[#2D3748] sm:mt-[20px]">
              Withdrawal & Received Trend
            </h2>
            <div className="mt-[20px]">
              <div className="relative w-[200px]">
                <Lucide
                  icon="Calendar"
                  className="absolute inset-y-0 left-0 z-10 my-auto ml-2 h-4 w-4 text-gray-500"
                />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-1 pl-10 text-sm"
                >
                  {yearOptions}
                </select>
              </div>
            </div>
          </div>
          <div className="relative mt-[20px] rounded-xl bg-white">
            <div className="ml-[25px] flex h-[50px] w-full items-center justify-between">
              <div className="mt-[20px] flex items-center space-x-4">
                <div className="text-center font-semibold">
                  <div className="text-xl">
                    {thisMonthTotal
                      ? formatThousands(thisMonthTotal).toLocaleString()
                      : '0'}
                  </div>
                  <div className="text-sm">This Month</div>
                </div>
                <div className="h-[50px] border-[1px] border-dashed"></div>

                <div className="text-center font-semibold">
                  <div className="text-xl">
                    {lastMonthTotal
                      ? formatThousands(lastMonthTotal).toLocaleString()
                      : '0'}
                  </div>
                  <div className="text-sm">Last Month</div>
                </div>
              </div>
              <div className="mr-[25px] mt-[12px]">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="mr-[25px] w-[120px] rounded-lg border border-gray-300 p-1 text-sm text-gray-500"
                >
                  <option value="All">All</option>
                  <option value="Withdrawals">Withdrawals</option>
                  <option value="Tips">Tips</option>
                </select>
              </div>
            </div>
            <ReactECharts
              option={option}
              notMerge={true}
              lazyUpdate={true}
              theme={''}
              style={{
                height: '500px',
                width: '100%',
                marginTop: '20px',
                backgroundColor: 'white',
                borderRadius: '12px',
              }}
              onChartReady={(chart) => console.log('Chart is ready:', chart)}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default TipsAndWithdrawalsChart
