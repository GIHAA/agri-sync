/* eslint-disable @typescript-eslint/no-explicit-any */
import { MutableRefObject } from 'react'

export interface CkeditorElement extends HTMLDivElement {
  CKEditor: any
}

export type CkeditorProps<C extends React.ElementType> =
  PolymorphicComponentPropWithRef<
    C,
    {
      value: string
      config?: any
      disabled?: boolean
      onChange: (data: any) => void
      onFocus?: (evt: any, editor: any) => void
      onBlur?: (evt: any, editor: any) => void
      onReady?: (editor: any) => void
      getRef?: (el: CkeditorElement) => void
    }
  >

const init = async <C extends React.ElementType>(
  el: CkeditorElement,
  editorBuild: any,
  {
    props,
    cacheData,
  }: {
    props: CkeditorProps<C>
    cacheData: MutableRefObject<string>
  }
) => {
  const { value, config } = props
  // Initial data
  const cData = cacheData
  cData.current = value
  config.initialData = props.value

  // Init CKEditor
  const editor = await editorBuild.create(el, props.config)

  // Attach CKEditor instance
  const element = el
  element.CKEditor = editor

  // Set initial disabled state
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  props.disabled && editor.enableReadOnlyMode('ckeditor')

  // Set on change event
  editor.model.document.on('change:data', () => {
    const data = editor.getData()
    cData.current = data
    props.onChange(data)
  })

  // Set on focus event
  editor.editing.view.document.on('focus', (evt: any) => {
    if (props.onFocus) {
      props.onFocus(evt, editor)
    }
  })

  // Set on blur event
  editor.editing.view.document.on('blur', (evt: any) => {
    if (props.onBlur) {
      props.onBlur(evt, editor)
    }
  })

  // Set on ready event
  if (props.onReady) {
    props.onReady(editor)
  }
}

// Watch model change
const updateData = <C extends React.ElementType>(
  el: CkeditorElement,
  {
    props,
    cacheData,
  }: {
    props: CkeditorProps<C>
    cacheData: MutableRefObject<string>
  }
) => {
  if (cacheData.current !== props.value) {
    el.CKEditor.setData(props.value)
  }
}

export { init, updateData }
