import clsx from 'clsx'
import { FieldError, FieldValues, UseFormRegister } from 'react-hook-form'
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
  register?: UseFormRegister<FieldValues>
  disabled?: boolean
  formInputSize?: 'sm' | 'lg'
  rounded?: boolean
  required?: boolean
  info?: string
  iconLeft?: any
  iconRight?: any
  error?: FieldError | string | undefined
  value?: string | number
  labelAlignment?: AlignmentTypes
  inputStyleClassName?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void // Added onChange
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
  onChange, 
  inputStyleClassName
}: InputProps) {
  const errorMessage =
    typeof error === 'string' || typeof error === 'undefined'
      ? error
      : error?.message || String(error)

  return (
    <div
      className={
        label
          ? ` ${
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
        {label && (
          <FormLabel
            htmlFor={id}
            className="m-0 mb-2 flex h-full max-h-[38px] items-center sm:mb-0"
          >
            <div className="text-left">
              <div className="flex items-center">
                <div className="font-medium">{label}</div>
                {required && (
                  <>
                    <div className="ml-1 hidden sm:flex">
                      <FormRequiredLabel />
                    </div>
                    <div className="mx-2 sm:hidden">
                      <FormRequiredIcon />
                    </div>
                  </>
                )}
                {info && (
                  <div className="flex sm:mx-2">
                    <FormInfo tooltip={info} />
                  </div>
                )}
              </div>
            </div>
          </FormLabel>
        )}
      </div>
      <div
        className={`grid md:h-10 ${
          labelAlignment === AlignmentTypes.BLOCK ? 'col-span-12' : 'col-span-3'
        }`}
      >
        <InputGroup className={` ${inputStyleClassName} mt-1 `}>
          {iconLeft && (
            <InputGroup.Text className=' bg-white'>
              <Lucide icon={iconLeft} className="h-4 w-4" />
            </InputGroup.Text>
          )}
          <FormInput
            {...(register ? register(name || '') : {})}
            className={clsx({
              'border-danger': error,
              'cursor-not-allowed opacity-50': disabled,
              [`input-${formInputSize}`]: formInputSize,
            })}
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            onChange={onChange}
          />
          {iconRight && (
            <InputGroup.Text>
              <Lucide icon={iconRight} className="h-4 w-4" />
            </InputGroup.Text>
          )}
        </InputGroup>
        {errorMessage && (
          <div className="mb-2 mt-1 h-2 text-danger">{errorMessage}</div>
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
  error: undefined, // Default to undefined
  value: undefined,
  labelAlignment: AlignmentTypes.ININE,
  onChange: undefined, // Default to undefined
}
