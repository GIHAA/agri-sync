import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  UseFormRegister,
} from 'react-hook-form'

import {
  FormInfo,
  FormLabel,
  FormRequiredIcon,
  FormRequiredLabel,
  FormSwitch,
} from './components'

interface InputProps {
  id?: string
  label?: string
  switchLabel?: string
  value?: string
  name?: string
  register: UseFormRegister<FieldValues>
  disabled?: boolean
  required?: boolean
  info?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
}

function FormSwitchElement({
  id,
  label,
  switchLabel,
  value,
  name,
  register,
  disabled,
  required,
  info,
  error,
}: InputProps) {
  return (
    <div
      className={label ? 'grid grid-flow-row grid-cols-1 sm:grid-cols-5' : ''}
    >
      <div className="col-span-4 grid">
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
                  {info ? <FormInfo toolagrisync={info} /> : ''}
                </div>
              </div>
            </div>
          </FormLabel>
        ) : (
          ''
        )}
      </div>
      <div className="col-span-1 grid">
        <FormSwitch>
          <FormSwitch.Input id={id} type="checkbox" />
          {switchLabel ? (
            <FormSwitch.Label htmlFor="product-status-active">
              {switchLabel}
            </FormSwitch.Label>
          ) : (
            ''
          )}
        </FormSwitch>
        {error && (
          <div className="mt-2 text-danger">
            {typeof error?.message === 'string' && error?.message}
          </div>
        )}
      </div>
    </div>
  )
}

export default FormSwitchElement

FormSwitchElement.defaultProps = {
  id: '',
  label: '',
  switchLabel: '',
  value: '',
  name: '',
  disabled: false,
  required: false,
  info: '',
  error: '',
}
