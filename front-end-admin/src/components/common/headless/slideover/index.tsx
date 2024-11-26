/* eslint-disable react/destructuring-assignment */
import { twMerge } from 'tailwind-merge'
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react'
import { Fragment, createContext, useContext, useRef, useState } from 'react'

type Size = 'sm' | 'md' | 'lg' | 'xl' | string

type ExtractProps<TComponentOrTProps> =
  TComponentOrTProps extends React.ComponentType<infer TProps>
    ? TProps
    : TComponentOrTProps

const slideOverContext = createContext<{
  open: boolean
  zoom: boolean
  size: Size
}>({
  open: false,
  zoom: false,
  size: 'md',
})

function SlideOver({
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
    <slideOverContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        open,
        zoom,
        size,
      }}
    >
      <Transition appear as={Fragment} show={open}>
        <HeadlessDialog
          as={as}
          // eslint-disable-next-line consistent-return
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
    </slideOverContext.Provider>
  )
}

SlideOver.Panel = function Panel({
  children,
  className,
  as = 'div',
  ...props
}: ExtractProps<typeof HeadlessDialog.Panel> & {
  // eslint-disable-next-line react/require-default-props
  size?: Size
}) {
  const slideOver = useContext(slideOverContext)
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
        enterFrom="opacity-0 -mr-[100%]"
        enterTo="opacity-100 mr-0"
        leave="ease-in-out duration-[400ms]"
        leaveFrom="opacity-100 mr-0"
        leaveTo="opacity-0 -mr-[100%]"
        className="fixed inset-y-0 right-0"
      >
        <HeadlessDialog.Panel
          as={as}
          className={twMerge([
            'relative ml-auto flex h-screen w-[90%] flex-col bg-slate-200 shadow-md transition-transform dark:bg-darkmode-300',
            slideOver.size === 'md' && 'sm:w-[460px]',
            slideOver.size === 'sm' && 'sm:w-[300px]',
            slideOver.size === 'lg' && 'sm:w-[600px]',
            slideOver.size === 'xl' && 'sm:w-[835px] lg:w-[835px]',
            slideOver.size === '2xl' && 'sm:w-[900px] lg:w-[1200px]',
            slideOver.zoom && 'scale-105',
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

SlideOver.Title = function Title({
  children,
  className,
  as = 'div',
  ...props
}: ExtractProps<typeof HeadlessDialog.Title>) {
  return (
    <HeadlessDialog.Title
      as={as}
      className={twMerge([
        'flex items-center border-b border-white px-5 py-3 dark:border-darkmode-600',
        className,
      ])}
      {...props}
    >
      {children}
    </HeadlessDialog.Title>
  )
}

SlideOver.Description = function Description({
  children,
  className,
  as = 'div',
  ...props
}: ExtractProps<typeof HeadlessDialog.Description>) {
  return (
    <HeadlessDialog.Description
      as={as}
      className={twMerge(['flex-1 overflow-y-auto p-5', className])}
      {...props}
    >
      {children}
    </HeadlessDialog.Description>
  )
}

SlideOver.Footer = function Footer<C extends React.ElementType = 'div'>({
  children,
  className,
  as,
  ...props
}: {
  // eslint-disable-next-line react/require-default-props
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

export default SlideOver

SlideOver.defaultProps = {
  size: 'md',
  staticBackdrop: false,
}
