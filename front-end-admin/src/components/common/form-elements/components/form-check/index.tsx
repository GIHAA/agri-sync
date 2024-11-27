/* eslint-disable jsx-a11y/label-has-associated-control */
import { twMerge } from 'tailwind-merge'

export type FormCheckProps = React.PropsWithChildren &
  React.ComponentPropsWithoutRef<'div'>

function FormCheck(props: FormCheckProps) {
  const { className, children } = props
  return (
    <div {...props} className={twMerge(['flex items-center', className])}>
      {children}
    </div>
  )
}

export type LabelProps = React.PropsWithChildren &
  React.ComponentPropsWithoutRef<'label'>

FormCheck.Label = function Label(props: LabelProps) {
  const { className, children } = props
  return (
    <label {...props} className={twMerge(['ml-2 cursor-pointer', className])}>
      {children}
    </label>
  )
}

interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  type: 'radio' | 'checkbox'
}

FormCheck.Input = function Input(props: InputProps) {
  const { type, className } = props
  return (
    <input
      {...props}
      className={twMerge([
        // Default
        'transition-all duration-100 ease-in-out',

        // Input type radio
        type === 'radio' &&
          'cursor-pointer border-slate-200 shadow-sm focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:ring-offset-0 dark:border-transparent dark:bg-darkmode-800 dark:focus:ring-slate-700 dark:focus:ring-opacity-50',

        // Input type checkbox
        type === 'checkbox' &&
          'cursor-pointer rounded border-slate-200 shadow-sm focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:ring-offset-0 dark:border-transparent dark:bg-darkmode-800 dark:focus:ring-slate-700 dark:focus:ring-opacity-50',

        // On checked
        "[&[type='radio']]:checked:border-primary [&[type='radio']]:checked:border-opacity-10 [&[type='radio']]:checked:bg-primary",
        "[&[type='checkbox']]:checked:border-primary [&[type='checkbox']]:checked:border-opacity-10 [&[type='checkbox']]:checked:bg-primary",

        // On checked and not disabled
        '[&:disabled:not(:checked)]:cursor-not-allowed [&:disabled:not(:checked)]:bg-slate-100 [&:disabled:not(:checked)]:dark:bg-darkmode-800/50',

        // On checked and disabled
        '[&:disabled:checked]:cursor-not-allowed [&:disabled:checked]:opacity-70 [&:disabled:checked]:dark:bg-darkmode-800/50',
        className,
      ])}
    />
  )
}

export default FormCheck
