import { useContext, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { formInlineContext } from '../form-inline'
import { inputGroupContext } from '../input-group'

interface FormTextareaProps extends React.ComponentPropsWithoutRef<'textarea'> {
  formTextareaSize?: 'sm' | 'lg'
  rounded?: boolean
  disabled?: boolean
}

type FormTextareaRef = React.ComponentPropsWithRef<'textarea'>['ref']

const FormTextarea = forwardRef(
  (props: FormTextareaProps, ref: FormTextareaRef) => {
    const formInline = useContext(formInlineContext)
    const inputGroup = useContext(inputGroupContext)
    const { formTextareaSize, rounded, disabled, ...computedProps } = props
    return (
      <textarea
        {...computedProps}
        disabled={disabled}
        ref={ref}
        className={twMerge([
          'disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:border-transparent dark:disabled:bg-darkmode-800/50',
          '[&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100 [&[readonly]]:dark:border-transparent [&[readonly]]:dark:bg-darkmode-800/50',
          'w-full rounded-md border-slate-200 text-sm shadow-sm transition duration-200 ease-in-out placeholder:text-slate-400/90 focus:border-primary focus:border-opacity-40 focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:border-transparent dark:bg-darkmode-800 dark:placeholder:text-slate-500/80 dark:focus:ring-slate-700 dark:focus:ring-opacity-50',
          props.formTextareaSize === 'sm' && 'px-2 py-1.5 text-xs',
          props.formTextareaSize === 'lg' && 'px-4 py-1.5 text-lg',
          props.rounded && 'rounded-full',
          formInline && 'flex-1',
          inputGroup &&
            'z-10 rounded-none first:rounded-l last:rounded-r [&:not(:first-child)]:border-l-transparent',
          props.className,
        ])}
      />
    )
  }
)

FormTextarea.displayName = 'FormTextarea'

export default FormTextarea

FormTextarea.defaultProps = {
  formTextareaSize: 'sm',
  rounded: false,
  disabled: false,
}
