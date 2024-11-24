/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react-hooks/exhaustive-deps */
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
  const colorScheme = useAppSelector(selectColorScheme)
  const darkMode = useAppSelector(selectDarkMode)

  const chartData = [15, 10, 65]
  const data: ChartData = useMemo(() => {
    return {
      labels: ['Yellow', 'Dark'],
      datasets: [
        {
          data: chartData,
          borderWidth: 5,
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
    }
  }, [colorScheme, darkMode])

  return (
    <Chart
      type="pie"
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
