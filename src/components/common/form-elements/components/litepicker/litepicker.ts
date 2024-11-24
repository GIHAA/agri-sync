import dayjs from 'dayjs'
import Litepicker from 'litepicker'
import { LitepickerElement, LitepickerProps } from './types'

const getDateFormat = (format: string | undefined) =>
  format !== undefined ? format : 'D MMM, YYYY'

const setValue = (props: LitepickerProps) => {
  const format = getDateFormat(props.options.format)
  if (!props.value.length) {
    let date = dayjs().format(format)
    date +=
      !props.options.singleMode && props.options.singleMode !== undefined
        ? ` - ${dayjs().add(1, 'month').format(format)}`
        : ''
    props.onChange(date)
  }
}

const init = (el: LitepickerElement, props: LitepickerProps) => {
  const format = getDateFormat(props.options.format)
  const element = el
  element.litePickerInstance = new Litepicker({
    ...props.options,
    element,
    format,
    setup: (picker /* FIX: React typescript issue :Picker */) => {
      if (picker.on) {
        picker.on('selected', (startDate, endDate) => {
          let date = dayjs(startDate.dateInstance).format(format)
          date +=
            endDate !== undefined
              ? ` - ${dayjs(endDate.dateInstance).format(format)}`
              : ''
          props.onChange(date)
        })
      }
    },
  })
}

const reInit = (el: LitepickerElement, props: LitepickerProps) => {
  el.litePickerInstance.destroy()
  init(el, props)
}

export { setValue, init, reInit }
