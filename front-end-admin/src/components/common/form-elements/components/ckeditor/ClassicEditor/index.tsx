import { createRef, useEffect, useRef } from 'react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import {
  init,
  updateData,
  /* CkeditorProps, */ CkeditorElement,
} from '../ckeditor'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Ckeditor<C extends React.ElementType = 'div'>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any
) {
  const editorRef = createRef<CkeditorElement>()
  const cacheData = useRef('')
  const initialRender = useRef(true)
  const {
    as,
    disabled,
    config,
    value,
    onChange,
    onFocus,
    onBlur,
    onReady,
    getRef,
    className,
    ...computedProps
  } = props

  useEffect(() => {
    if (editorRef.current) {
      if (initialRender.current) {
        if (getRef) {
          getRef(editorRef.current)
        }
        init(editorRef.current, ClassicEditor, { props, cacheData })
        initialRender.current = false
      } else {
        updateData(editorRef.current, { props, cacheData })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const Component = as || 'div'

  return (
    <Component
      {...computedProps}
      ref={editorRef}
      value={value}
      onChange={onChange}
      className={className}
    />
  )
}

Ckeditor.defaultProps = {
  disabled: false,
  config: {},
  value: '',
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
  onReady: () => {},
  getRef: () => {},
}

export default Ckeditor
