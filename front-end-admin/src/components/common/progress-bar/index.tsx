import { useEffect, useState } from 'react'
import Progress from './progress-bar'

const array: string[] = [
  'w-0/6',
  'w-1/6',
  'w-2/6',
  'w-3/6',
  'w-4/6',
  'w-5/6',
  'w-6/6',
]

function ProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(progressInterval)
  }, [])

  return (
    <Progress className="mt-3">
      <Progress.Bar
        className={String(array[progress])}
        role="progressbar"
        aria-valuenow={0}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </Progress>
  )
}

export default ProgressBar
