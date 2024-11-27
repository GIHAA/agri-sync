import { useContext } from 'react'
import { twMerge } from 'tailwind-merge'
import { formInlineContext } from '../form-inline'

interface FormSelectProps extends React.ComponentPropsWithoutRef<'select'> {
  formSelectSize?: 'sm' | 'lg'
}

function FormSelect(props: FormSelectProps) {
  const formInline = useContext(formInlineContext)
  const { formSelectSize, className, children, ...computedProps } = props
  return (
    <select
      {...computedProps}
      className={twMerge([
        'disabled:cursor-not-allowed disabled:bg-slate-100 disabled:dark:bg-darkmode-800/50',
        '[&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100 [&[readonly]]:dark:bg-darkmode-800/50',
        'w-full rounded-md border-slate-200 px-3 py-2 pr-8 text-sm shadow-sm transition duration-200 ease-in-out focus:border-primary focus:border-opacity-40 focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:border-transparent dark:bg-darkmode-800 dark:focus:ring-slate-700 dark:focus:ring-opacity-50',
        formSelectSize === 'sm' && 'py-1.5 pl-2 pr-8 text-xs',
        formSelectSize === 'lg' && 'py-1.5 pl-4 pr-8 text-lg',
        formInline && 'flex-1',
        className,
      ])}
    >
      {children}
    </select>
  )
}

export default FormSelect

FormSelect.defaultProps = {
  formSelectSize: '',
}
