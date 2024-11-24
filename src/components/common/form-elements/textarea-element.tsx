import clsx from 'clsx'
import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  UseFormRegister,
} from 'react-hook-form'
import { AlignmentTypes } from '../../../constants/common-enums'

import {
  FormTextarea,
  FormLabel,
  FormRequiredIcon,
  FormInfo,
  FormRequiredLabel,
} from './components'

interface TextareaProps {
  id?: string
  label?: string
  name?: string
  placeholder?: string
  register: UseFormRegister<FieldValues>
  disabled?: boolean
  formTextareaSize?: 'sm' | 'lg'
  rounded?: boolean
  required?: boolean
  info?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
  labelAlignment?: AlignmentTypes
}

function TextareaElement({
  id,
  label,
  name,
  placeholder,
  register,
  disabled,
  formTextareaSize,
  rounded,
  required,
  info,
  error,
  labelAlignment,
}: TextareaProps) {
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
                <div className="hidden sm:flex">
                  {required ? <FormRequiredLabel /> : ''}
                </div>
                <div className="mx-2 sm:hidden">
                  {required ? <FormRequiredIcon /> : ''}
                </div>
                <div className="flex sm:mx-2">
                  {info ? <FormInfo tooltip={info} /> : ''}
                </div>
              </div>
            </div>
          </FormLabel>
        ) : (
          ''
        )}
      </div>
      <div
        className={`grid  md:h-20 ${
          labelAlignment === AlignmentTypes.BLOCK ? 'col-span-12' : 'col-span-3'
        }`}
      >
        <FormTextarea
          {...register(`${name}`)}
          id={id}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          formTextareaSize={formTextareaSize}
          rounded={rounded}
          className={clsx({
            'border-danger': error,
          })}
        />
        {error && (
          <div className="mt-1 text-danger">
            {typeof error?.message === 'string' && error?.message}
          </div>
        )}
      </div>
    </div>
  )
}

export default TextareaElement

TextareaElement.defaultProps = {
  id: '',
  label: '',
  name: '',
  placeholder: '',
  disabled: false,
  formTextareaSize: '',
  rounded: false,
  required: false,
  info: '',
  error: '',
  labelAlignment: AlignmentTypes.ININE,
}
