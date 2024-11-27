import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  UseFormRegister,
} from 'react-hook-form'
import {
  FormCheck,
  FormInfo,
  FormLabel,
  FormRequiredIcon,
  FormRequiredLabel,
} from './components'

interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  id?: string
  label?: string
  value?: string | number
  name?: string
  htmlFor?: string
  type?: any
  register: UseFormRegister<FieldValues>
  disabled?: boolean
  options?: { id: number; label: string }[]
  required?: boolean
  info?: string
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
  labelAlignment?: 'left' | 'center' | 'right' // New prop for label alignment
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void // New onChange prop
}

function FormCheckElement({
  id,
  label,
  type,
  htmlFor,
  value,
  name,
  register,
  required,
  info,
  error,
  labelAlignment = 'left', // Default value
  onChange, // Destructure the onChange prop
}: InputProps) {
  return (
    <div
      className={label ? 'grid grid-flow-row grid-cols-1 sm:grid-cols-5' : ''}
    >
      <div className="col-span-2 grid">
        {label ? (
          <FormLabel
            htmlFor={id}
            className={`m-0 mb-2 flex h-full max-h-[38px] items-center sm:mb-0 text-${labelAlignment}`} // Apply alignment here
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
        <FormCheck {...register(`${name}`)} className="mt-2">
          <FormCheck.Input
            id={id}
            type={type}
            name={name}
            value={value}
            onChange={onChange} // Attach the onChange handler here
          />
          <FormCheck.Label htmlFor={htmlFor}>{value}</FormCheck.Label>
        </FormCheck>
        {error && (
          <div className="mt-2 text-danger">
            {typeof error?.message === 'string' && error?.message}
          </div>
        )}
      </div>
    </div>
  )
}

export default FormCheckElement

FormCheckElement.defaultProps = {
  id: '',
  label: '',
  value: '',
  name: '',
  type: 'radio',
  htmlFor: '',
  disabled: false,
  required: false,
  info: '',
  error: '',
  options: [{ id: 1, label: 'Please Select' }],
  labelAlignment: 'left', // Default value for label alignment
  onChange: undefined, // Default onChange
}
