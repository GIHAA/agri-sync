import { createRef, useEffect, useRef } from 'react'

import { setValue, init, reInit } from './litepicker'
import FormInput from '../form-input'
import { LitepickerElement, LitepickerProps } from './types'

function Litepicker(props: LitepickerProps) {
  const { options, value, onChange, getRef, ...computedProps } = props
  const initialRender = useRef(true)
  const litepickerRef = createRef<LitepickerElement>()
  const tempValue = useRef(value)

  useEffect(() => {
    if (litepickerRef.current) {
      getRef(litepickerRef.current)
    }

    if (initialRender.current) {
      setValue(props)
      if (litepickerRef.current !== null) {
        init(litepickerRef.current, props)
      }
      initialRender.current = false
    } else if (tempValue.current !== value && litepickerRef.current !== null) {
      reInit(litepickerRef.current, props)
    }

    tempValue.current = value
  }, [getRef, litepickerRef, props, value])

  return (
    <FormInput
      ref={litepickerRef}
      type="text"
      value={value}
      onChange={(e) => {
        onChange(e.target.value)
      }}
      {...computedProps}
    />
  )
}

Litepicker.defaultProps = {
  options: {},
  value: '',
  onChange: () => {},
  getRef: () => {},
}

export default Litepicker
