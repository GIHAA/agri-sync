import { twMerge } from 'tailwind-merge'

type FormHelpProps = React.PropsWithChildren &
  React.ComponentPropsWithoutRef<'div'>

function FormHelp(props: FormHelpProps) {
  const { className, children } = props
  return (
    <div
      {...props}
      className={twMerge(['mt-2 text-xs text-slate-500', className])}
    >
      {children}
    </div>
  )
}

export default FormHelp
