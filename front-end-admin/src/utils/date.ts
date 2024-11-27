const getDateValue = (dateInput: string) => {
  const inputDate = new Date(dateInput)

  const options: any = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return inputDate.toLocaleDateString('en-US', options)
}

export default getDateValue
