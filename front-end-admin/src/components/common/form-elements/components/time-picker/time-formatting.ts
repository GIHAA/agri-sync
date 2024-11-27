/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/newline-after-import */
import { DateTime } from 'luxon'
export const getDateByIso = (value: string) => {
  const dt = DateTime.fromISO(value)
  const formattedDate = dt.toFormat('LLL d, yyyy')
  return formattedDate
}

export const getTimeByIso = (value: string) => {
  const dt = DateTime.fromISO(value)
  const formattedTime = dt.toFormat('HH:mm')
  return formattedTime
}
