import { createRef, useEffect, useRef, useMemo } from 'react'
import clsx from 'clsx'
import { setValue, init, updateValue } from './tom-select'
import { TomSelectElement, TomSelectProps } from './types'

function TomSelect(props: TomSelectProps) {
  const initialRender = useRef(true)
  const tomSelectRef = createRef<TomSelectElement>()
  const {
    options: optionsProp,
    value,
    onOptionAdd,
    onChange,
    getRef,
    className,
    children,
    ...computedProps
  } = props

  // Compute all default options
  const computedOptions = useMemo(() => {
    let options: TomSelectProps['options'] = {
      ...optionsProp,
      plugins: {
        dropdown_input: {},
        ...optionsProp.plugins,
      },
    }

    if (Array.isArray(value)) {
      options = {
        persist: false,
        create: true,
        onDelete(values: string[]) {
          /* TODO: Replace with notification component */
          // eslint-disable-next-line no-alert
          return window.confirm(
            values.length > 1
              ? `Are you sure you want to remove these ${values.length} items?`
              : `Are you sure you want to remove "${values[0]}"?`
          )
        },
        ...options,
        plugins: {
          remove_button: {
            title: 'Remove this item',
          },
          ...options.plugins,
        },
      }
    }

    return options
  }, [optionsProp, value])

  useEffect(() => {
    if (tomSelectRef.current) {
      getRef(tomSelectRef.current)

      if (initialRender.current) {
        // Clone the select element to prevent tom select remove the original element
        const clonedEl = tomSelectRef.current.cloneNode(
          true
        ) as TomSelectElement

        // Save initial classnames
        const classNames = tomSelectRef.current?.getAttribute('class')
        if (classNames) {
          clonedEl.setAttribute('data-initial-class', classNames)
        }

        // Hide original element
        if (tomSelectRef.current?.parentNode) {
          tomSelectRef.current?.parentNode.appendChild(clonedEl)
          tomSelectRef.current.setAttribute('hidden', 'true')
        }

        // Initialize tom select
        setValue(clonedEl, props)
        init(tomSelectRef.current, clonedEl, props, computedOptions)

        initialRender.current = false
      } else {
        const clonedEl = tomSelectRef.current
          .nextElementSibling as TomSelectElement
        updateValue(
          tomSelectRef.current,
          clonedEl,
          value,
          props,
          computedOptions
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tomSelectRef, value, className])

  return (
    <select
      {...computedProps}
      ref={tomSelectRef}
      value={value}
      onChange={(event) => {
        onChange(event.target.value)
      }}
      className={clsx(['tom-select', className])}
    >
      {children}
    </select>
  )
}

TomSelect.defaultProps = {
  className: '',
  options: {},
  value: '',
  onOptionAdd: () => {},
  onChange: () => {},
  getRef: () => {},
}

export default TomSelect
