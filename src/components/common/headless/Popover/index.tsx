import { twMerge } from 'tailwind-merge'
import { Popover as HeadlessPopover, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import clsx from 'clsx'

function Popover({
  children,
  className,
  ...props
}: ExtractProps<typeof HeadlessPopover>) {
  return (
    <HeadlessPopover
      as="div"
      className={twMerge(['relative', className])}
      {...props}
    >
      {children}
    </HeadlessPopover>
  )
}

Popover.Button = function ({
  children,
  className,
  ...props
}: ExtractProps<typeof HeadlessPopover.Button>) {
  return (
    <HeadlessPopover.Button
      as="div"
      className={twMerge(['cursor-pointer', className])}
      {...props}
    >
      {children}
    </HeadlessPopover.Button>
  )
}

Popover.Panel = function ({
  children,
  className,
  placement = 'bottom-end',
  ...props
}: ExtractProps<typeof HeadlessPopover.Panel> & {
  placement?:
    | 'top-start'
    | 'top'
    | 'top-end'
    | 'right-start'
    | 'right'
    | 'right-end'
    | 'bottom-end'
    | 'bottom'
    | 'bottom-start'
    | 'left-start'
    | 'left'
    | 'left-end'
}) {
  return (
    <Transition
      as={Fragment}
      enter="transition-all ease-linear duration-150"
      enterFrom="mt-5 invisible opacity-0 translate-y-1"
      enterTo="mt-1 visible opacity-100 translate-y-0"
      leave="transition-all ease-linear duration-150"
      leaveFrom="mt-1 visible opacity-100 translate-y-0"
      leaveTo="mt-5 invisible opacity-0 translate-y-1"
    >
      <div
        className={clsx([
          'absolute z-30',
          placement == 'top-start' && 'bottom-[100%] left-0',
          placement == 'top' && 'bottom-[100%] left-[50%] translate-x-[-50%]',
          placement == 'top-end' && 'bottom-[100%] right-0',
          placement == 'right-start' && 'left-[100%] translate-y-[-50%]',
          placement == 'right' && 'left-[100%] top-[50%] translate-y-[-50%]',
          placement == 'right-end' && 'bottom-0 left-[100%]',
          placement == 'bottom-end' && 'right-0 top-[100%]',
          placement == 'bottom' && 'left-[50%] top-[100%] translate-x-[-50%]',
          placement == 'bottom-start' && 'left-0 top-[100%]',
          placement == 'left-start' && 'right-[100%] translate-y-[-50%]',
          placement == 'left' && 'right-[100%] top-[50%] translate-y-[-50%]',
          placement == 'left-end' && 'bottom-0 right-[100%]',
        ])}
      >
        <HeadlessPopover.Panel
          as="div"
          className={twMerge([
            'rounded-md border-transparent bg-white p-2 shadow-[0px_3px_20px_#0000000b] dark:border-transparent dark:bg-darkmode-600',
            className,
          ])}
          {...props}
        >
          {children}
        </HeadlessPopover.Panel>
      </div>
    </Transition>
  )
}

export default Popover
