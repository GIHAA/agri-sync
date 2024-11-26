/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
import { ChartData, ChartOptions } from 'chart.js/auto'
import { useMemo } from 'react'
import Chart from '../../base-components/Chart'
import { selectColorScheme } from '../../stores/colorSchemeSlice'
import { selectDarkMode } from '../../stores/darkModeSlice'
import { useAppSelector } from '../../stores/hooks'

interface MainProps extends React.ComponentPropsWithoutRef<'canvas'> {
  width: number
  height: number
}

function Main(props: MainProps) {
  const data: ChartData = useMemo(() => {
    return {
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      datasets: [
        {
          label: '# of Votes',
          data: [0, 200, 250, 200, 700, 550, 650, 1050, 950, 1100, 900, 1200],
          borderWidth: 2,
          backgroundColor: 'transparent',
          pointBorderColor: 'transparent',
          tension: 0.4,
        },
        {
          label: '# of Votes',
          data: [0, 300, 400, 560, 320, 600, 720, 850, 690, 805, 1200, 1010],
          borderWidth: 2,
          borderDash: [2, 2],

          backgroundColor: 'transparent',
          pointBorderColor: 'transparent',
          tension: 0.4,
        },
      ],
    }
  }, [])

  const options: ChartOptions = useMemo(() => {
    return {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 12,
            },
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
            callback(value) {
              return `$${value}`
            },
          },
        },
      },
    }
  }, [])

  return (
    <Chart
      type="line"
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
