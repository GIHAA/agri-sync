import clsx from 'clsx'
import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  UseFormRegister,
} from 'react-hook-form'
import Lucide from '../lucide'

import {
  FormInfo,
  FormLabel,
  // FormRequiredIcon,
  // FormRequiredLabel,
  FormSelect,
  InputGroup,
} from './components'
import { AlignmentTypes } from '../../../constants/common-enums'

interface InputProps {
  id?: string
  label?: string
  name?: string
  register: UseFormRegister<FieldValues>
  disabled?: boolean
  formSelectSize?: 'sm' | 'lg'
  // options?: { id: number; name: string }[]
  options?: { id: number; name: string; value?: string }[]
  required?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  iconLeft?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  iconRight?: any
  onClickLeft?: () => void
  onClickRight?: () => void
  info?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
  labelAlignment?: AlignmentTypes
}

function SelectElement({
  id,
  label,
  name,
  register,
  disabled,
  formSelectSize,
  required,
  iconLeft,
  iconRight,
  onClickLeft,
  onClickRight,
  info,
  error,
  options,
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
        className={`grid md:h-10 ${
          labelAlignment === AlignmentTypes.BLOCK ? 'col-span-12' : 'col-span-3'
        }`}
      >
        <div className="flex">
          {iconLeft ? (
            <InputGroup.Text className="rounded-l-md" onClick={onClickLeft}>
              <Lucide icon={iconLeft} className="h-4 w-4" />
            </InputGroup.Text>
          ) : (
            ''
          )}
          <div className="flex-1">
            <FormSelect
              formSelectSize={formSelectSize}
              aria-label=".form-select-lg example"
              {...register(name || '')}
              className={clsx({
                'sm:mr-2': true,
                'border-danger': error,
              })}
              id={id}
              name={name}
              disabled={disabled}
            >
              {options?.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.name}
                </option>
              ))}
            </FormSelect>
          </div>
          {iconRight ? (
            <InputGroup.Text className="rounded-r-md" onClick={onClickRight}>
              <Lucide icon={iconRight} className="h-4 w-4" />
            </InputGroup.Text>
          ) : (
            ''
          )}
        </div>
        {error && (
          <div className="mt-1 text-danger">
            {typeof error?.message === 'string' && error?.message}
          </div>
        )}
      </div>
    </div>
  )
}

export default SelectElement

SelectElement.defaultProps = {
  id: '',
  label: '',
  name: '',
  disabled: false,
  formSelectSize: '',
  required: false,
  iconLeft: '',
  iconRight: '',
  info: '',
  error: '',
  options: [],
  onClickLeft: () => {},
  onClickRight: () => {},
  labelAlignment: AlignmentTypes.ININE,
}
