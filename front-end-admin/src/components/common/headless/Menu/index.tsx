/* eslint-disable func-names */
/* eslint-disable eqeqeq */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
/* eslint-disable react/display-name */
import { twMerge } from 'tailwind-merge'
import { Menu as HeadlessMenu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import clsx from 'clsx'

type ButtonProps = ExtractProps<typeof HeadlessMenu.Button> & {
  variant?: string
  size?: string
  tag?: string
}

function Menu({
  children,
  className,
  ...props
}: ExtractProps<typeof HeadlessMenu>) {
  return (
    <HeadlessMenu
      as="div"
      className={twMerge(['relative', className])}
      {...props}
    >
      {children}
    </HeadlessMenu>
  )
}

Menu.Button = function ({
  children,
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  return (
    <HeadlessMenu.Button
      as="div"
      className={twMerge(['cursor-pointer', className])}
      {...props}
    >
      {children}
    </HeadlessMenu.Button>
  )
}

Menu.Items = function ({
  children,
  className,
  placement = 'bottom-end',
  ...props
}: ExtractProps<typeof HeadlessMenu.Items> & {
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
        <HeadlessMenu.Items
          as="div"
          className={twMerge([
            'rounded-md border-transparent bg-white p-2 shadow-[0px_3px_10px_#00000017] dark:border-transparent dark:bg-darkmode-600',
            className,
          ])}
          {...props}
        >
          {children}
        </HeadlessMenu.Items>
      </div>
    </Transition>
  )
}

Menu.Item = function ({
  children,
  className,
  ...props
}: ExtractProps<typeof HeadlessMenu.Item>) {
  return (
    <HeadlessMenu.Item
      as="a"
      className={twMerge([
        'flex cursor-pointer items-center rounded-md p-2 transition duration-300 ease-in-out hover:bg-slate-200/60 dark:bg-darkmode-600 dark:hover:bg-darkmode-400',
        className,
      ])}
      {...props}
    >
      {children}
    </HeadlessMenu.Item>
  )
}

Menu.Devider = function (props: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={twMerge([
        '-mx-2 my-2 h-px bg-slate-200/60 dark:bg-darkmode-400',
        props.className,
      ])}
    />
  )
}

Menu.Header = function (
  props: React.PropsWithChildren & React.ComponentPropsWithoutRef<'div'>
) {
  return (
    <div className={twMerge(['p-2 font-medium', props.className])}>
      {props.children}
    </div>
  )
}

Menu.Footer = function (
  props: React.PropsWithChildren & React.ComponentPropsWithoutRef<'div'>
) {
  return (
    <div className={twMerge(['flex p-1', props.className])}>
      {props.children}
    </div>
  )
}

export default Menu
