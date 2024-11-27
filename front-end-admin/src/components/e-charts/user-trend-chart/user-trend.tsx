import React, { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import {
  GetNewTPCountByMonth,
  GetNewSPCountByMonth,
  GetNewBothCountByMonth,
} from '../../../api/dashboard/dashboard'
import { monthNames } from '../../../constants/months'
import NoDataFound from '../../../assets/images/NoDataFound.png'
import Lucide from '../../common/lucide'

const UserTrendChart: React.FC = () => {
  const spQuery = GetNewSPCountByMonth()
  const tpQuery = GetNewTPCountByMonth()
  const bothQuery = GetNewBothCountByMonth()

  const [spChartData, setSpChartData] = useState<
    { month: string; count: string }[] | undefined
  >()
  const [tpChartData, setTpChartData] = useState<
    { month: string; count: string }[] | undefined
  >()
  const [bothChartData, setBothChartData] = useState<
    { month: string; count: string }[] | undefined
  >()

  const [thisMonthTotal, setThisMonthTotal] = useState(0)
  const [lastMonthTotal, setLastMonthTotal] = useState(0)
  const [selectedType, setSelectedType] = useState('All')
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  )

  useEffect(() => {
    if (spQuery.data && tpQuery.data && bothQuery.data) {
      const spData = spQuery.data.SPCount
      const tpData = tpQuery.data.TPCount
      const bothData = bothQuery.data.BothCount

      setSpChartData(spData)
      setTpChartData(tpData)
      setBothChartData(bothData)

      calculateTotals(spData, tpData, bothData, selectedType)
    }
  }, [spQuery.data, tpQuery.data, bothQuery.data, selectedType, selectedYear])

  const calculateTotals = (
    spData: { month: string; count: string }[] | undefined,
    tpData: { month: string; count: string }[] | undefined,
    bothData: { month: string; count: string }[] | undefined,
    selectedType: string
  ) => {
    let thisMonthCount = 0
    let lastMonthCount = 0
    const year = parseInt(selectedYear, 10)
    const currentDate = new Date()
    const currentMonth = `${selectedYear}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, '0')}`
    const lastMonthDate = new Date(year, currentDate.getMonth() - 1)
    const lastMonth = `${selectedYear}-${String(
      lastMonthDate.getMonth() + 1
    ).padStart(2, '0')}`

    const getMonthCount = (
      data: { month: string; count: string }[],
      targetMonth: string
    ) => {
      return parseInt(
        data.find((item) => item.month === targetMonth)?.count || '0',
        10
      )
    }

    if (spData && tpData && bothData) {
      if (selectedType === 'All') {
        thisMonthCount =
          getMonthCount(spData, currentMonth) +
          getMonthCount(tpData, currentMonth) +
          getMonthCount(bothData, currentMonth)
        lastMonthCount =
          getMonthCount(spData, lastMonth) +
          getMonthCount(tpData, lastMonth) +
          getMonthCount(bothData, lastMonth)
      } else if (selectedType === 'Service Providers') {
        thisMonthCount = getMonthCount(spData, currentMonth)
        lastMonthCount = getMonthCount(spData, lastMonth)
      } else if (selectedType === 'Agrisyncpers') {
        thisMonthCount = getMonthCount(tpData, currentMonth)
        lastMonthCount = getMonthCount(tpData, lastMonth)
      } else if (selectedType === 'Both') {
        thisMonthCount = getMonthCount(bothData, currentMonth)
        lastMonthCount = getMonthCount(bothData, lastMonth)
      }

      setThisMonthTotal(thisMonthCount)
      setLastMonthTotal(lastMonthCount)
    }
  }
  const yearOptions = Array.from({ length: 4 }, (_, i) => {
    const year = new Date().getFullYear() - i
    return (
      <option key={year} value={year.toString()}>
        {year}/01 to {year}/12
      </option>
    )
  })

  const xAxisData = Array.from({ length: 12 }, (_, i) =>
    `${i + 1}`.padStart(2, '0')
  )

  const formattedXAxisData = xAxisData.map(
    (month) => monthNames[parseInt(month, 10) - 1]
  )

  const spYAxisData = xAxisData.map(
    (month) =>
      spChartData?.find(
        (data) =>
          data.month.startsWith(selectedYear) && data.month.slice(5) === month
      )?.count || 0
  )
  const tpYAxisData = xAxisData.map(
    (month) =>
      tpChartData?.find(
        (data) =>
          data.month.startsWith(selectedYear) && data.month.slice(5) === month
      )?.count || 0
  )
  const bothYAxisData = xAxisData.map(
    (month) =>
      bothChartData?.find(
        (data) =>
          data.month.startsWith(selectedYear) && data.month.slice(5) === month
      )?.count || 0
  )

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
        name: 'Service Providers',
        type: 'line',
        data: spYAxisData,
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
        name: 'Agrisyncpers',
        type: 'line',
        data: tpYAxisData,
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
      {
        name: 'Both',
        type: 'line',
        data: bothYAxisData,
        smooth: true,
        lineStyle: {
          color: '#000000',
          width: 2,
          type: 'dotted',
        },
        itemStyle: {
          color: '#000000',
          borderWidth: 3,
        },
      },
    ]
  } else if (selectedType === 'Service Providers') {
    seriesData = [
      {
        name: 'Service Providers',
        type: 'line',
        data: spYAxisData,
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
  } else if (selectedType === 'Agrisyncpers') {
    seriesData = [
      {
        name: 'Agrisyncpers',
        type: 'line',
        data: tpYAxisData,
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
  } else if (selectedType === 'Both') {
    seriesData = [
      {
        name: 'Both',
        type: 'line',
        data: bothYAxisData,
        smooth: true,
        lineStyle: {
          color: '#000000',
          width: 2,
          type: 'solid',
        },
        itemStyle: {
          color: '#000000',
          borderWidth: 3,
        },
      },
    ]
  }

  const option = {
    toolagrisync: {
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
      data: formattedXAxisData,
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
      splitLine: {
        lineStyle: {
          type: 'dotted',
          color: '#EDEDED',
        },
      },
      axisLabel: {
        fontSize: 14,
        color: '#64748b',
      },
    },
    series: seriesData,
  }
  const hasData =
    (spChartData?.length ?? 0) > 0 ||
    (tpChartData?.length ?? 0) > 0 ||
    (bothChartData?.length ?? 0) > 0

  return (
    <div>
      <div className="intro-y block h-fit items-center justify-between space-x-4 sm:flex">
        <h2 className="mt-[30px] w-fit text-[19px] text-lg font-medium text-[#2D3748]">
          User Trend
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

      <div className="relative mt-[15px] rounded-xl bg-white">
        {!hasData ? (
          <div className="mt-[10px] flex w-full flex-col items-center  justify-center rounded-xl bg-white px-4  shadow-md">
            <img
              src={NoDataFound}
              alt="No data found"
              className="max-h-[395px] min-h-[395px] w-fit object-cover"
            />
            <span className="mb-12 text-center">No Data Found...</span>
          </div>
        ) : (
          <>
            <div className="ml-[25px] flex h-[50px] w-full items-center justify-between">
              <div className="mt-[20px] flex items-center space-x-4">
                <div className="text-center font-semibold">
                  <div className="text-xl">
                    {thisMonthTotal ? thisMonthTotal.toLocaleString() : '0'}
                  </div>
                  <div className="text-sm">This Month</div>
                </div>
                <div className="h-[50px] border-[1px] border-dashed"></div>

                <div className="text-center font-semibold">
                  <div className="text-xl">
                    {lastMonthTotal ? lastMonthTotal.toLocaleString() : '0'}
                  </div>
                  <div className="text-sm">Last Month</div>
                </div>
              </div>
              <div className="mr-[25px] mt-[12px]">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="mr-[25px] w-[140px] rounded-lg border border-gray-300 p-1 text-sm text-gray-500"
                >
                  <option value="All">All</option>
                  <option value="Service Providers">Service Providers</option>
                  <option value="Agrisyncpers">Agrisyncpers</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>

            <ReactECharts
              option={option}
              notMerge={true}
              lazyUpdate={true}
              theme={''}
              style={{
                height: '387px',
                width: '100%',
                marginTop: '25px',
                backgroundColor: 'white',
                borderRadius: '12px',
              }}
              onChartReady={(chart) => console.log('Chart is ready:', chart)}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default UserTrendChart
