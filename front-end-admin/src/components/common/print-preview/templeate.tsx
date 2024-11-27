/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from 'react'

/* eslint-disable react/display-name */
const PrintTemplate = forwardRef((_props, ref: any) => {
  return <div ref={ref}>My cool content here!</div>
})

export default PrintTemplate
