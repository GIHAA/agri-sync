import clsx from 'clsx'

import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  UseFormRegister,
} from 'react-hook-form'
import {
  FormInfo,
  FormInput,
  FormLabel,
  FormRequiredIcon,
  FormRequiredLabel,
  InputGroup,
} from './components'
import Lucide from '../lucide'
import { AlignmentTypes } from '../../../constants/common-enums'

interface InputProps {
  id?: string
  label?: string
  name?: string
  type?: 'text' | 'password' | 'email' | 'number'
  placeholder?: string
  register: UseFormRegister<FieldValues>
  disabled?: boolean
  formInputSize?: 'sm' | 'lg'
  rounded?: boolean
  required?: boolean
  info?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  iconLeft?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  iconRight?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
  value?: string | number
  labelAlignment?: AlignmentTypes
}

function InputElement({
  id,
  label,
  name,
  type,
  placeholder,
  register,
  disabled,
  formInputSize,
  rounded,
  required,
  info,
  iconLeft,
  iconRight,
  error,
  value,
  labelAlignment,
}: InputProps) {
  // Handler to block non-numeric input
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === 'number' && !/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Tab' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      event.preventDefault();
    }
  };

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
                  {required ? <FormRequiredLabel /> : ''}
                </div>
                <div className="mx-2 sm:hidden">
                  {required ? <FormRequiredIcon /> : ''}
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
        className={`grid md:h-10 ${
          labelAlignment === AlignmentTypes.BLOCK ? 'col-span-12' : 'col-span-3'
        }`}
      >
        <InputGroup className="">
          {iconLeft ? (
            <InputGroup.Text>
              <Lucide icon={iconLeft} className="h-4 w-4" />
            </InputGroup.Text>
          ) : (
            ''
          )}
          <FormInput
            {...register(`${name}`)}
            className={clsx({
              'border-danger': error,
            })}
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            formInputSize={formInputSize}
            rounded={rounded}
            value={value && value}
            onKeyDown={handleKeyDown}
            inputMode={type === 'number' ? 'numeric' : undefined}
            pattern={type === 'number' ? '[0-9]*' : undefined}
          />
          {iconRight ? (
            <InputGroup.Text>
              <Lucide icon={iconRight} className="h-4 w-4" />
            </InputGroup.Text>
          ) : (
            ''
          )}
        </InputGroup>
        {error && (
          <div className="mb-2 mt-1 h-2 text-danger">
            {typeof error?.message === 'string' && error?.message}
          </div>
        )}
      </div>
    </div>
  )
}

export default InputElement

InputElement.defaultProps = {
  id: '',
  label: '',
  name: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  formInputSize: '',
  rounded: false,
  required: false,
  info: '',
  iconLeft: undefined,
  iconRight: undefined,
  error: '',
  value: undefined,
  labelAlignment: AlignmentTypes.ININE,
}
