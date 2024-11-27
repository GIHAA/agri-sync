import { createContext, useContext } from 'react'
import { twMerge } from 'tailwind-merge'

type InputGroupProps = React.PropsWithChildren &
  React.ComponentPropsWithoutRef<'div'>

export const inputGroupContext = createContext(false)

function InputGroup(props: InputGroupProps) {
  const { children, className } = props

  return (
    <inputGroupContext.Provider value>
      <div {...props} className={twMerge(['flex', className])}>
        {children}
      </div>
    </inputGroupContext.Provider>
  )
}

type TextProps = React.PropsWithChildren & React.ComponentPropsWithoutRef<'div'>

InputGroup.Text = function Text(props: TextProps) {
  const inputGroup = useContext(inputGroupContext)
  const { children, className } = props
  return (
    <div
      {...props}
      className={twMerge([
        'border border-slate-200 bg-slate-100 px-3 py-2 text-slate-600 shadow-sm dark:border-darkmode-900/20 dark:bg-darkmode-900/20 dark:text-slate-400',
        inputGroup &&
          'rounded-none first:rounded-l last:rounded-r [&:not(:first-child)]:border-l-transparent',
        className,
      ])}
    >
      {children}
    </div>
  )
}

export default InputGroup
