import React, { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import { GetUsersCountByType } from '../../../api/dashboard/dashboard'
import NoDataFound from '../../../assets/images/NoDataFound.png'

function UserCountChart() {
  const { data: counts, isLoading, error } = GetUsersCountByType()

  const chartRef = useRef(null)

  const [selectedUserType, setSelectedUserType] = useState('Both')

  useEffect(() => {
    let myChart: echarts.ECharts

    if (!isLoading && counts) {
      const chartDom = chartRef.current
      myChart = echarts.init(chartDom)

      let data: { value: any; name: string }[] = []
      if (selectedUserType === 'Both') {
        data = [
          { value: counts?.Both.active, name: 'Active' },
          { value: counts?.Both.deactive, name: 'Inactive' },
          { value: counts?.Both.new, name: 'New' },
        ]
      } else if (selectedUserType === 'ServiceProviders') {
        data = [
          { value: counts?.ServiceProviders.active, name: 'Active' },
          { value: counts?.ServiceProviders.deactive, name: 'Inactive' },
          { value: counts?.ServiceProviders.new, name: 'New' },
        ]
      } else if (selectedUserType === 'Tippers') {
        data = [
          { value: counts?.Tippers.active, name: 'Active' },
          { value: counts?.Tippers.deactive, name: 'Inactive' },
          { value: counts?.Tippers.new, name: 'New' },
        ]
      }

      const option = {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          show: true,
          bottom: '-5px sm:-5px',
        },
        series: [
          {
            name: 'User Status',
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
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                position: 'outside',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            color: ['#10b981', '#ef5675', '#7a5195', '#0d4c8c'],
            data: data as any,
          },
        ],
        graphic: {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: `${
              data.find((item) => item.name === 'Active')?.value || 0
            }\n Active Users`,
            textAlign: 'center',
            fontSize: 22,
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
  }, [counts, isLoading, selectedUserType])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <div>
        <div className="mt-[30px]">
          <h2 className="mr-5 text-[19px] text-lg font-medium text-[#2D3748]">
            Insights
          </h2>
        </div>
        <div className="mt-[15px] flex w-full flex-col items-center  justify-center rounded-xl bg-white px-4  shadow-md">
          <img
            src={NoDataFound}
            alt="No data found"
            className="max-h-[395px] min-h-[395px] w-fit object-cover"
          />
          <span className="mb-12 text-center">No Data Found...</span>
        </div>
      </div>
    )
  }
  return (
    <div className="mt-[30px]">
      <div>
        <h2 className="mr-5 text-[19px] text-lg font-medium text-[#2D3748]">
          Insights
        </h2>
      </div>
      <div className="mt-[15px] flex w-full flex-col items-center rounded-xl bg-white pt-4">
        <div className="mb-4 flex items-center justify-between gap-2">
          <button
            className={`max-h-[30px] min-h-[30px] cursor-pointer rounded-md border-none px-2 py-1 ${
              selectedUserType === 'Tippers'
                ? 'bg-black text-white'
                : 'bg-gray-200 text-black'
            }`}
            onClick={() => setSelectedUserType('Tippers')}
          >
            Tipper
          </button>
          <button
            className={`max-h-[30px] min-h-[30px] cursor-pointer rounded-md border-none px-2 py-1 ${
              selectedUserType === 'ServiceProviders'
                ? 'bg-black text-white'
                : 'bg-gray-200 text-black'
            }`}
            onClick={() => setSelectedUserType('ServiceProviders')}
          >
            {/* Service Provider */}
            <span className="hidden 2xl:block">Service Provider</span>
            <span className="block 2xl:hidden">SP</span>
          </button>
          <button
            className={`max-h-[30px] min-h-[30px] cursor-pointer rounded-md border-none px-2 py-1 ${
              selectedUserType === 'Both'
                ? 'bg-black text-white'
                : 'bg-gray-200 text-black'
            }`}
            onClick={() => setSelectedUserType('Both')}
          >
            Both
          </button>
        </div>
        <div
          ref={chartRef}
          className="w-full"
          style={{ height: '400px', paddingBottom: '25px' }}
        ></div>
      </div>
    </div>
  )
}

export default UserCountChart
