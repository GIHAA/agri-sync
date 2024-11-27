/* eslint-disable prettier/prettier */
import clsx from 'clsx'
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form'
import { Icons } from '../../../constants'
import { AlignmentTypes } from '../../../constants/common-enums'

import Lucide from '../lucide'
import {
  FormInfo,
  FormLabel,
  Litepicker,
} from './components'

interface InputProps {
  id?: string
  label?: string
  name?: string
  placeholder?: string
  disabled?: boolean
  formInputSize?: 'sm' | 'lg'
  required?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: string
  // eslint-disable-next-line @typescript-eslint/ban-types
  options?: Object
  info?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
  onChange: (date: string) => void
  labelAlignment?: AlignmentTypes
}

function DateElement({
  id,
  label,
  name,
  placeholder,
  disabled,
  formInputSize,
  required,
  value,
  onChange,
  options,
  info,
  error,
  labelAlignment,
}: InputProps) {
  return (
    <div
      className={
        label
          ? `grid sm:grid-cols-5 ${
              labelAlignment === AlignmentTypes.BLOCK
                ? 'flow-cols-grid grid-cols-12'
                : 'grid-flow-row grid-cols-1'
            }`
          : ''
      }
    >
      <div
        className={`grid ${
          labelAlignment === AlignmentTypes.BLOCK
            ? 'col-span-12 mb-2'
            : 'col-span-2'
        }`}
      >
        {label ? (
          <FormLabel
          htmlFor={id}
          className="m-0 mb-2 flex h-full max-h-[38px] items-center sm:mb-0"
        >
          <div className="text-left">
            <div className="flex items-center">
              <div className="font-medium">{label}</div>
              <div className="ml-1 hidden sm:flex">
                {required ? <span className="text-red-500">*</span> : ''}
              </div>
              <div className="flex sm:mx-2">
                {info ? <FormInfo toolagrisync={info} /> : ''}
              </div>
            </div>
          </div>
        </FormLabel>
        ) : (
          ''
        )}
      </div>
      <div
        className={`relative grid w-full ${
          labelAlignment === AlignmentTypes.BLOCK ? 'col-span-12' : 'col-span-3'
        }`}
      >
        <div>
          <div
            className={`${
              error ? 'border-danger' : ''
            } absolute flex h-full max-h-[38px] w-10 items-center justify-center rounded-l border bg-slate-100 text-slate-500 dark:border-darkmode-800 dark:bg-darkmode-700 dark:text-slate-400`}
          >
            <Lucide icon={Icons.CALENDAR} className="h-4 w-4" />
          </div>
          <Litepicker
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            formInputSize={formInputSize}
            name={name}
            options={options}
            disabled={disabled}
            className={clsx({
              'pl-12': true,
              'border-danger': error,
            })}
          />
        </div>
        {error && (
          <div className="mt-2 text-danger">
            {typeof error?.message === 'string' && error?.message}
          </div>
        )}
      </div>
    </div>
  )
}

export default DateElement

DateElement.defaultProps = {
  id: '',
  label: '',
  name: '',
  placeholder: '',
  disabled: false,
  formInputSize: '',
  required: false,
  value: '',
  info: '',
  options: {
    autoApply: true,
    showWeekNumbers: true,
    dropdowns: {
      minYear: 1990,
      maxYear: null,
      months: true,
      years: true,
    },
  },
  error: '',
  labelAlignment: AlignmentTypes.ININE,
}
