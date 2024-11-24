/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/require-default-props */
/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import { ChartData, ChartOptions } from 'chart.js/auto'
import { useMemo } from 'react'
import Chart from '../../base-components/Chart'
// import { getColor } from '../../utils/colors'
import { selectColorScheme } from '../../stores/colorSchemeSlice'
import { selectDarkMode } from '../../stores/darkModeSlice'
import { useAppSelector } from '../../stores/hooks'

interface MainProps extends React.ComponentPropsWithoutRef<'canvas'> {
  width: number
  height: number
}

function Main(props: MainProps) {
  const colorScheme = useAppSelector(selectColorScheme)
  const darkMode = useAppSelector(selectDarkMode)

  const data: ChartData = useMemo(() => {
    return {
      labels: ['Others', 'Transport'],
      datasets: [
        {
          label: 'Total Expense',
          barPercentage: 10,
          barThickness: 96,
          maxBarThickness: 96,
          minBarLength: 1,
          data: [0, 5, 10, 15, 20, 25],
          
        },
      ],
    }
  }, [colorScheme, darkMode])

  const options: ChartOptions = useMemo(() => {
    return {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            // color: getColor('slate.500', 0.8),
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 12,
            },
            // color: getColor('slate.500', 0.8),
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            font: {
              size: 12,
            },
            // color: getColor('slate.500', 0.8),
            callback(value) {
              return `${value}`
            },
          },
          // grid: {
          //   color: darkMode
          //     ? getColor('slate.500', 0.3)
          //     : getColor('slate.300'),
          //   borderDash: [2, 2],
          //   drawBorder: false,
          // },
        },
      },
    }
  }, [colorScheme, darkMode])

  return (
    <Chart
      type="bar"
      width={props.width}
      height={props.height}
      data={data}
      options={options}
      className={props.className}
    />
  )
}

Main.defaultProps = {
  width: 'auto',
  height: 'auto',
  className: '',
}

export default Main
