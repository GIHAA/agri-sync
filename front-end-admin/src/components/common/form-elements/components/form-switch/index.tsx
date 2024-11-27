import { twMerge } from 'tailwind-merge'
import FormCheck, { FormCheckProps, LabelProps } from '../form-check'

function FormSwitch(props: FormCheckProps) {
  const { children } = props
  return <FormCheck {...props}>{children}</FormCheck>
}

FormSwitch.Label = function Label(props: LabelProps) {
  const { children } = props
  return <FormCheck.Label {...props}>{children}</FormCheck.Label>
}

interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  type: 'checkbox'
}

FormSwitch.Input = function Input(props: InputProps) {
  const { className } = props
  return (
    <FormCheck.Input
      {...props}
      className={twMerge([
        // Default
        'relative h-[24px] w-[38px] rounded-full p-px',
        'before:absolute before:inset-y-0 before:my-auto before:h-[20px] before:w-[20px] before:rounded-full before:shadow-[1px_1px_3px_rgba(0,0,0,0.25)] before:transition-[margin-left] before:duration-200 before:ease-in-out before:dark:bg-darkmode-600',

        // On checked
        'checked:border-primary checked:bg-primary checked:bg-none',
        'before:checked:ml-[14px] before:checked:bg-white',

        className,
      ])}
    />
  )
}

export default FormSwitch
