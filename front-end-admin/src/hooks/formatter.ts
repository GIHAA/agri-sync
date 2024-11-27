export const formatRating = (rating: any) => {
  const numRating = typeof rating === 'number' ? rating : parseFloat(rating)
  return isNaN(numRating) ? 'N/A' : numRating.toFixed(1)
}

export const formatTiles = (rating: any) => {
  const numRating = typeof rating === 'number' ? rating : parseFloat(rating)
  return isNaN(numRating) ? 'N/A' : numRating.toFixed(2)
}

export const formatDate = (dateString: Date) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}` 
}
export const formatTotal = (amount: any) => {
  const Total = typeof amount === 'number' ? amount : parseFloat(amount)
  return isNaN(Total) ? 'N/A' : Total.toFixed(2)
}

export const formatMonthTotal = (amount: any) => {
  const Total = typeof amount === 'number' ? amount : parseFloat(amount)
  return isNaN(Total) ? 'N/A' : Total.toFixed(0)
}

export const formatAmount = (value: number | string): string => {
  const numberValue = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(numberValue)) return 'N/A'
  return numberValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export const formatThousands = (value: number | string): string => {
  const numberValue = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(numberValue)) return 'N/A'
  return numberValue.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

export const getDateValue = (dateInput: string) => {
  const inputDate = new Date(dateInput)

  const options: any = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return inputDate.toLocaleDateString('en-US', options)
}

