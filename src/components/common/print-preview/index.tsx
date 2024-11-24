/* eslint-disable react/no-unstable-nested-components */
import { useRef } from 'react'
import ReactToPrint from 'react-to-print'

import PrintTemplate from './templeate'

function PrintPreview() {
  const componentRef = useRef(null)

  return (
    <div>
      <ReactToPrint
        trigger={() => <button type="button">Print this out!</button>}
        content={() => componentRef.current}
      />
      <PrintTemplate ref={componentRef} />
    </div>
  )
}

export default PrintPreview
