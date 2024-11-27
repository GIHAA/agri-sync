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
import Button from '../button'

type Variant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'pending'
  | 'danger'
  | 'dark'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-success'
  | 'outline-warning'
  | 'outline-pending'
  | 'outline-danger'
  | 'outline-dark'
  | 'soft-primary'
  | 'soft-secondary'
  | 'soft-success'
  | 'soft-warning'
  | 'soft-pending'
  | 'soft-danger'
  | 'soft-dark'
  | 'facebook'
  | 'twitter'
  | 'instagram'
  | 'linkedin'

type Elevated = boolean
type Size = 'sm' | 'lg'
type Rounded = boolean

interface InputProps {
  id?: string
  label?: string
  btnLabel?: string
  name?: string
  register: UseFormRegister<FieldValues>
  variant: Variant
  elevated?: Elevated
  size?: Size
  rounded?: Rounded
  required?: boolean
  info?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
}

function UploadFilesElement({
  id,
  label,
  btnLabel,
  name,
  register,
  size,
  variant,
  elevated,
  rounded,
  required,
  info,
  error,
}: InputProps) {
  return (
    <div
      className={label ? 'grid grid-flow-row grid-cols-1 sm:grid-cols-5' : ''}
    >
      <div className="col-span-2 grid">
        {label ? (
          <FormLabel
            htmlFor={id}
            className="m-0 mb-2 flex h-full max-h-[38px] items-center sm:mb-0"
          >
            <div className="text-left">
              <div className="flex flex-wrap items-center justify-start">
                <div className="mr-2 font-medium">{label}</div>
                <div className={`${required ? 'mr-2' : 'mr-0'} hidden sm:flex`}>
                  {required ? <FormRequiredLabel /> : ''}
                </div>
                <div
                  className={`${required ? 'mr-2 sm:mr-0' : 'mr-0'} sm:hidden`}
                >
                  {required ? <FormRequiredIcon /> : ''}
                </div>
                <div className={`${required || info ? 'mr-2' : 'mr-0'} flex`}>
                  {info ? <FormInfo toolagrisync={info} /> : ''}
                </div>
              </div>
            </div>
          </FormLabel>
        ) : (
          ''
        )}
      </div>
      <div className="col-span-3 grid">
        <Button
          size={size}
          elevated={elevated}
          rounded={rounded}
          variant={variant}
          className="mr-2 w-full shadow-md"
        >
          {btnLabel}
        </Button>
        {error && (
          <div className="mt-2 text-danger">
            {typeof error?.message === 'string' && error?.message}
          </div>
        )}
      </div>
    </div>
  )
}

export default UploadFilesElement

UploadFilesElement.defaultProps = {
  id: '',
  label: '',
  btnLabel: '',
  name: '',
  required: false,
  rounded: false,
  elevated: false,
  info: '',
  error: '',
  size: '',
}
