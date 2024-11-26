import { createContext } from 'react'
import { twMerge } from 'tailwind-merge'

type FormInlineProps = React.PropsWithChildren &
  React.ComponentPropsWithoutRef<'div'>

export const formInlineContext = createContext(false)

function FormInline(props: FormInlineProps) {
  const { className, children } = props
  return (
    <formInlineContext.Provider value>
      <div
        {...props}
        className={twMerge(['block items-center sm:flex', className])}
      >
        {children}
      </div>
    </formInlineContext.Provider>
  )
}

export default FormInline
