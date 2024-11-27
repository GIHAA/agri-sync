import React, { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import { GetAgeByRole } from '../../../api/dashboard/dashboard'
import NoDataFound from '../../../assets/images/NoDataFound.png'

interface AgeGroupData {
  '18-30': number
  '31-50': number
  '51+': number
  'Below 18': number
}

interface AgeDistributionData {
  tp: AgeGroupData
  sp: AgeGroupData
  both: AgeGroupData
}

function AgeDistributionChart() {
  const { data: ageDistribution, isLoading, error } = GetAgeByRole()
  const chartRef = useRef(null)
  const [selectedUserType, setSelectedUserType] = useState('both')

  const calculateTotalAndPercentages = (data: { [x: string]: any }) => {
    if (!data)
      return {
        total: 0,
        percentages: { '18-30': 0, '31-50': 0, '51+': 0, 'Below 18': 0 },
      }

    const total =
      data['18-30'] + data['31-50'] + data['51+'] + data['Below 18'] || 0
    const percentages = {
      '18-30': ((data['18-30'] || 0) / total) * 100 || 0,
      '31-50': ((data['31-50'] || 0) / total) * 100 || 0,
      '51+': ((data['51+'] || 0) / total) * 100 || 0,
      'Below 18': ((data['Below 18'] || 0) / total) * 100 || 0,
    }
    return { total, percentages }
  }

  useEffect(() => {
    let myChart: echarts.ECharts

    if (!isLoading && ageDistribution) {
      const chartDom = chartRef.current
      myChart = echarts.init(chartDom)

      let data: AgeGroupData = {
        '18-30': 0,
        '31-50': 0,
        '51+': 0,
        'Below 18': 0,
      }

      if (selectedUserType === 'both') {
        data = ageDistribution?.both || data
      } else if (selectedUserType === 'sp') {
        data = ageDistribution?.sp || data
      } else if (selectedUserType === 'tp') {
        data = ageDistribution?.tp || data
      }

      const option = {
        toolagrisync: {
          trigger: 'item',
        },
        legend: {
          show: false,
        },
        series: [
          {
            name: 'Age Distribution',
            type: 'pie',
            radius: ['80%', '60%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderColor: 'transparent',
              borderWidth: 10,
            },
            label: {
              show: false,
              position: 'outside',
            },
            labelLine: {
              show: false,
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                position: 'outside',
                fontWeight: 'bold',
              },
            },
            color: ['#7a5195', '#6B7280', '#f59e0b', '#003f5c'],
            data: [
              { value: data['18-30'] || 0, name: '18-30' },
              { value: data['31-50'] || 0, name: '31-50' },
              { value: data['51+'] || 0, name: '51+' },
              { value: data['Below 18'] || 0, name: 'Below 18' },
            ],
          },
        ],
        graphic: {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: `${
              data['18-30'] + data['31-50'] + data['51+'] + data['Below 18']
            } Users`,
            textAlign: 'center',
            fontSize: 24,
            fontWeight: 'lighter',
            fill: '#787878',
          },
        },
      }

      myChart.setOption(option)

      const handleResize = () => {
        if (myChart) {
          myChart.resize()
        }
      }

      window.addEventListener('resize', handleResize)

      return () => {
        if (myChart) {
          myChart.dispose()
        }
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [ageDistribution, isLoading, selectedUserType])
  if (
    !ageDistribution ||
    Object.values(ageDistribution as AgeDistributionData).every(
      (group) =>
        typeof group === 'object' &&
        group !== null &&
        Object.values(group).every(
          (value) => typeof value === 'number' && value <= 0
        )
    )
  ) {
    return (
      <div>
        <h2 className="mr-5 mt-[28px] text-[19px] text-lg font-medium text-[#2D3748]">
          Users Age Range
        </h2>
        <div className="mt-[15px] flex w-full flex-col items-center justify-center rounded-xl bg-white px-4 shadow-md">
          <img
            src={NoDataFound}
            alt="No data found"
            className="max-h-[500px] min-h-[500px] w-fit object-cover"
          />
          <span className="mb-12 text-center">No Data Found...</span>
        </div>
      </div>
    )
  }

  const selectedData =
    selectedUserType === 'both'
      ? ageDistribution?.both
      : selectedUserType === 'sp'
      ? ageDistribution?.sp
      : ageDistribution?.tp

  const { total, percentages } = calculateTotalAndPercentages(selectedData)

  return (
    <div>
      <h2 className="mr-5 mt-[28px] text-[19px] text-lg font-medium text-[#2D3748]">
        Users Age Range
      </h2>

      <div className="mt-[19px] flex w-full flex-col items-center rounded-xl bg-white py-4">
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
          <button
            className={`max-h-[30px] min-h-[30px] cursor-pointer rounded-md border-none px-2 py-1 ${
              selectedUserType === 'tp'
                ? 'bg-black text-white'
                : 'bg-gray-200 text-black'
            }`}
            onClick={() => setSelectedUserType('tp')}
          >
            Agrisyncper
          </button>
          <button
            className={`max-h-[30px] min-h-[30px] cursor-pointer rounded-md border-none px-2 py-1 ${
              selectedUserType === 'sp'
                ? 'bg-black text-white'
                : 'bg-gray-200 text-black'
            }`}
            onClick={() => setSelectedUserType('sp')}
          >
            <span className="hidden 2xl:block">Service Provider</span>
            <span className="block 2xl:hidden">SP</span>
          </button>
          <button
            className={`max-h-[30px] min-h-[30px] cursor-pointer rounded-md border-none px-2 py-1 ${
              selectedUserType === 'both'
                ? 'bg-black text-white'
                : 'bg-gray-200 text-black'
            }`}
            onClick={() => setSelectedUserType('both')}
          >
            Both
          </button>
        </div>

        <div
          ref={chartRef}
          className="w-full"
          style={{ height: '410px' }}
        ></div>

        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: '#7a5195' }}
            ></div>
            <span>18-30 Years old</span>
            <span>{percentages['18-30'].toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: '#6B7280' }}
            ></div>
            <span>31-50 Years old</span>
            <span>{percentages['31-50'].toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: '#f59e0b' }}
            ></div>
            <span>51+ Years old</span>
            <span>{percentages['51+'].toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: '#003f5c' }}
            ></div>
            <span>Below 18</span>
            <span>{percentages['Below 18'].toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgeDistributionChart
