/* eslint-disable consistent-return */
/* eslint-disable func-names */
/* eslint-disable eqeqeq */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { twMerge } from 'tailwind-merge'
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react'
import { Fragment, createContext, useContext, useRef, useState } from 'react'

type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const dialogContext = createContext<{
  open: boolean
  zoom: boolean
  size: Size
}>({
  open: false,
  zoom: false,
  size: 'md',
})

function Dialog({
  children,
  className,
  as = 'div',
  open = false,
  onClose,
  staticBackdrop,
  size = 'md',
  ...props
}: ExtractProps<typeof HeadlessDialog> & {
  size?: Size
  staticBackdrop?: boolean
}) {
  const focusElement = useRef<HTMLElement | null>(null)
  const [zoom, setZoom] = useState(false)

  return (
    <dialogContext.Provider
      value={{
        open,
        zoom,
        size,
      }}
    >
      <Transition appear as={Fragment} show={open}>
        <HeadlessDialog
          as={as}
          onClose={(value) => {
            if (!staticBackdrop) {
              return onClose(value)
            }
            setZoom(true)
            setTimeout(() => {
              setZoom(false)
            }, 300)
          }}
          initialFocus={focusElement}
          className={twMerge(['relative z-[60]', className])}
          {...props}
        >
          {children}
        </HeadlessDialog>
      </Transition>
    </dialogContext.Provider>
  )
}

Dialog.Panel = function ({
  children,
  className,
  as = 'div',
  ...props
}: ExtractProps<typeof HeadlessDialog.Panel> & {
  size?: Size
}) {
  const dialog = useContext(dialogContext)
  return (
    <>
      <Transition.Child
        as="div"
        enter="ease-in-out duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in-out duration-[400ms]"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="fixed inset-0 bg-black/60"
        aria-hidden="true"
      />
      <Transition.Child
        as="div"
        enter="ease-in-out duration-500"
        enterFrom="opacity-0 -mt-16"
        enterTo="opacity-100 mt-16"
        leave="ease-in-out duration-[400ms]"
        leaveFrom="opacity-100 mt-16"
        leaveTo="opacity-0 -mt-16"
        className="fixed inset-0"
      >
        <HeadlessDialog.Panel
          as={as}
          className={twMerge([
            'relative mx-auto w-[90%] rounded-md bg-white shadow-md transition-transform dark:bg-darkmode-600',
            dialog.size == 'md' && 'sm:w-[460px]',
            dialog.size == 'sm' && 'sm:w-[300px]',
            dialog.size == 'lg' && 'sm:w-[600px]',
            dialog.size == 'xl' && 'sm:w-[600px] lg:w-[900px]',
            dialog.zoom && 'scale-105',
            className,
          ])}
          {...props}
        >
          {children}
        </HeadlessDialog.Panel>
      </Transition.Child>
    </>
  )
}

Dialog.Title = function ({
  children,
  className,
  as = 'div',
  ...props
}: ExtractProps<typeof HeadlessDialog.Title>) {
  return (
    <HeadlessDialog.Title
      as={as}
      className={twMerge([
        'flex items-center border-b border-slate-200/60 px-5 py-3 dark:border-darkmode-400',
        className,
      ])}
      {...props}
    >
      {children}
    </HeadlessDialog.Title>
  )
}

Dialog.Description = function ({
  children,
  className,
  as = 'div',
  ...props
}: ExtractProps<typeof HeadlessDialog.Description>) {
  return (
    <HeadlessDialog.Description
      as={as}
      className={twMerge(['p-5', className])}
      {...props}
    >
      {children}
    </HeadlessDialog.Description>
  )
}

Dialog.Footer = function <C extends React.ElementType = 'div'>({
  children,
  className,
  as,
  ...props
}: {
  as?: C
} & React.PropsWithChildren &
  React.ComponentPropsWithoutRef<C>) {
  const Component = as || 'div'

  return (
    <Component
      className={twMerge([
        'border-t border-slate-200/60 px-5 py-3 text-right dark:border-darkmode-400',
        className,
      ])}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Dialog
