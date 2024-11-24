/* eslint-disable prettier/prettier */
import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  UseFormRegister,
} from 'react-hook-form'
import {
  ClassicEditor,
  FormInfo,
  FormInline,
  FormLabel,
} from './components'

interface InputProps {
  id?: string
  label?: string
  name?: string
  register: UseFormRegister<FieldValues>
  disabled?: boolean
  rounded?: boolean
  required?: boolean
  info?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: string
  onChange?: (event: Event) => void
  error?:
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<VoidFunction>>
    | undefined
}

function ClassicEditorElement({
  id,
  label,
  name,
  register,
  required,
  info,
  value,
  onChange,
}: InputProps) {
  return (
    <FormInline className="mt-5 flex-col items-start pt-5 first:mt-0 first:pt-0 xl:flex-row">
      <div className="col-span-2 grid">
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
      <div className="mt-3 w-full flex-1 -translate-x-1 xl:mt-0">
        <ClassicEditor
          {...register(`${name}`)}
          value={value}
          onChange={onChange}
        />
      </div>
    </FormInline>
  )
}

export default ClassicEditorElement

ClassicEditorElement.defaultProps = {
  id: '',
  label: '',
  name: '',
  disabled: false,
  rounded: false,
  required: false,
  info: '',
  value: '',
  onChange: '',
  error: '',
}
