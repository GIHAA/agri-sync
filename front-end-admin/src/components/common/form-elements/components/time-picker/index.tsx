/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/function-component-definition */
import { useState } from 'react'
import './datepicker.css'

const DateTimePicker = ({
  setDateTime,
}: {
  setDateTime: (value: string) => void
}) => {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [day, setDay] = useState(new Date().getDate())
  const [time, setTime] = useState('00:00')

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = Number(event.target.value)
    setYear(selectedYear)
    updateDateTime(selectedYear, month, day, time)
  }

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = Number(event.target.value)
    setMonth(selectedMonth)
    updateDateTime(year, selectedMonth, day, time)
  }

  const handleDayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDay = Number(event.target.value)
    setDay(selectedDay)
    updateDateTime(year, month, selectedDay, time)
  }

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTime = event.target.value
    setTime(selectedTime)
    updateDateTime(year, month, day, selectedTime)
  }

  const updateDateTime = (y: number, m: number, d: number, t: string) => {
    const formattedMonth = m.toString().padStart(2, '0')
    const formattedDay = d.toString().padStart(2, '0')
    const dateTime = `${y}-${formattedMonth}-${formattedDay}T${t}`
    setDateTime(dateTime)
  }

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate()
  }

  return (
    <div className="datepicker-container">
      <select value={year} onChange={handleYearChange} className="year-select">
        {Array.from({ length: 101 }, (_, index) => {
          const y = new Date().getFullYear() - 50 + index
          return (
            <option key={y} value={y}>
              {y}
            </option>
          )
        })}
      </select>

      <select
        value={month}
        onChange={handleMonthChange}
        className="month-select rounded-lg"
      >
        {Array.from({ length: 12 }, (_, index) => {
          const m = index + 1
          return (
            <option key={m} value={m}>
              {m.toString().padStart(2, '0')}
            </option>
          )
        })}
      </select>

      <input
        type="number"
        value={day}
        onChange={handleDayChange}
        step="1"
        min="1"
        max={getDaysInMonth(year, month)}
        className="day-input rounded-lg"
      />

      <input
        type="time"
        value={time}
        onChange={handleTimeChange}
        className="time-input rounded-lg"
      />
    </div>
  )
}

export default DateTimePicker
