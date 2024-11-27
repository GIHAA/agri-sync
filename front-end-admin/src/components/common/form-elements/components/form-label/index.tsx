/* eslint-disable prettier/prettier */
/* eslint-disable react/require-default-props */
// FormLabel.tsx
import React, { useContext } from 'react'
import { twMerge } from 'tailwind-merge'
import { formInlineContext } from '../form-inline'

type FormLabelProps = React.PropsWithChildren & React.ComponentPropsWithoutRef<'label'> & {
  required?: boolean;
}

function FormLabel(props: FormLabelProps) {
  const formInline = useContext(formInlineContext)
  const { className, children, id, required } = props

  return (
    <label
      {...props}
      htmlFor={id}
      className={twMerge([
        'mb-2 inline-block',
        formInline && 'mb-2 sm:mb-0 sm:mr-5 sm:text-right',
        className,
      ])}
    >
      {children}
      {required && <span className="text-red-500 ml-1">Required</span>}
    </label>
  )
}

export default FormLabel
