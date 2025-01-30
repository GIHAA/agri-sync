/* eslint-disable prettier/prettier */
import clsx from 'clsx'
import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  UseFormRegister,
} from 'react-hook-form'
import { AlignmentTypes } from '../../../constants/common-enums'
import Lucide from '../lucide'
import { FormInfo, FormLabel, InputGroup, TomSelect } from './components'

interface InputProps {
  id?: string
  label?: string
  name?: string
  register: UseFormRegister<FieldValues>
  disabled?: boolean
  options?: { id: number; label: string }[]
  required?: boolean
  info?: string
  onChange: (value: string) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  iconLeft?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  iconRight?: any
  onClickLeft?: () => void
  onClickRight?: () => void
  labelAlignment?: AlignmentTypes
}

function SearchSelectElement({
  id,
  label,
  name,
  register,
  disabled,
  required,
  info,
  error,
  options,
  onChange,
  iconLeft,
  iconRight,
  onClickLeft,
  onClickRight,
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
        className={`grid ${
          labelAlignment === AlignmentTypes.BLOCK ? 'col-span-12' : 'col-span-3'
        }`}
      >
        <div className="flex">
          {iconLeft ? (
            <InputGroup.Text
              className="rounded-l-md hover:cursor-pointer"
              onClick={onClickLeft}
            >
              <Lucide icon={iconLeft} className="h-4 w-4" />
            </InputGroup.Text>
          ) : (
            ''
          )}
          <div className="flex-1">
            <TomSelect
              // value={value}
              {...register(`${name}`)}
              onChange={onChange}
              disabled={disabled}
              name={name}
              id={id}
              className={clsx({
                'border-danger': error,
              })}
            >
              {options?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </TomSelect>
          </div>
          {iconRight ? (
            <InputGroup.Text
              className="rounded-r-md hover:cursor-pointer"
              onClick={onClickRight}
            >
              <Lucide icon={iconRight} className="h-4 w-4" />
            </InputGroup.Text>
          ) : (
            ''
          )}
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

export default SearchSelectElement

SearchSelectElement.defaultProps = {
  id: '',
  label: '',
  name: '',
  disabled: false,
  required: false,
  info: '',
  error: '',
  options: [{ id: 1, label: 'Please Select' }],
  iconLeft: '',
  iconRight: '',
  onClickLeft: () => {},
  onClickRight: () => {},
  labelAlignment: AlignmentTypes.ININE,
}
