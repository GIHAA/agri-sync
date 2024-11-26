/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/no-cycle */
/* eslint-disable react/require-default-props */
import { createRef, useEffect, useRef, useMemo } from 'react'
import { TomSettings, RecursivePartial } from 'tom-select/src/types/index'
import TomSelectPlugin from 'tom-select'

import clsx from 'clsx'
import { setValue, init, updateValue } from './tom-select'

export interface TomSelectElement extends HTMLSelectElement {
  TomSelect: TomSelectPlugin
}

export interface TomSelectProps
  extends Omit<
    React.PropsWithChildren & React.ComponentPropsWithoutRef<'select'>,
    'onChange'
  > {
  value: string | string[]
  onOptionAdd: (value: string) => void
  onChange(
    value: React.SetStateAction<string> | React.SetStateAction<string[]>
  ): void
  options: RecursivePartial<TomSettings>
  getRef: (el: TomSelectElement) => void
}

function TomSelect(props: TomSelectProps) {
  const initialRender = useRef(true)
  const tomSelectRef = createRef<TomSelectElement>()

  // Compute all default options
  const computedOptions = useMemo(() => {
    let options: TomSelectProps['options'] = {
      ...props.options,
      plugins: {
        dropdown_input: {},
        ...props.options.plugins,
      },
    }

    if (Array.isArray(props.value)) {
      options = {
        persist: false,
        create: true,
        onDelete(values: string[]) {
          return confirm(
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
  }, [props.options])

  useEffect(() => {
    if (tomSelectRef.current) {
      props.getRef(tomSelectRef.current)

      if (initialRender.current) {
        // Clone the select element to prevent tom select remove the original element
        const clonedEl = tomSelectRef.current.cloneNode(
          true
        ) as TomSelectElement

        // Save initial classnames
        const classNames = tomSelectRef.current?.getAttribute('class')
        classNames && clonedEl.setAttribute('data-initial-class', classNames)

        // Hide original element
        tomSelectRef.current?.parentNode &&
          tomSelectRef.current?.parentNode.appendChild(clonedEl)
        tomSelectRef.current.setAttribute('hidden', 'true')

        // Initialize tom select
        setValue(clonedEl, props)
        init(tomSelectRef.current, clonedEl, props, computedOptions)

        initialRender.current = false
      } else {
        const clonedEl = tomSelectRef.current
          .nextElementSibling as TomSelectElement
        const { value } = props
        updateValue(
          tomSelectRef.current,
          clonedEl,
          value,
          props,
          computedOptions
        )
      }
    }
  }, [tomSelectRef, props.value, props.className])

  const { options, value, onOptionAdd, onChange, getRef, ...computedProps } =
    props
  return (
    <select
      {...computedProps}
      ref={tomSelectRef}
      value={props.value}
      onChange={(event) => {
        props.onChange(event.target.value)
      }}
      className={clsx(['tom-select', props.className])}
    >
      {props.children}
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
