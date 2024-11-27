/* eslint-disable react/destructuring-assignment */
/* eslint-disable prettier/prettier */
import { twMerge } from 'tailwind-merge'
import { createContext, useContext } from 'react'

interface TableProps
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<'table'> {
  dark?: boolean
  bordered?: boolean
  hover?: boolean
  striped?: boolean
  sm?: boolean
}

const tableContext = createContext<{
  dark: TableProps['dark']
  bordered: TableProps['bordered']
  // hover: TableProps['hover']
  striped: TableProps['striped']
  sm: TableProps['sm']
}>({
  dark: false,
  bordered: false,
  // hover: false,
  striped: false,
  sm: false,
})
function Table({
  className,
  dark,
  bordered,
  hover,
  striped,
  sm,
  ...props
}: TableProps) {
  return (
    <tableContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        dark,
        bordered,
        // hover,
        striped,
        sm,
      }}
    >
      <table
        className={twMerge([
          'w-full text-left',
          dark && 'bg-dark text-white dark:bg-black/30',
          className,
        ])}
        {...props}
      >
        {props.children}
      </table>
    </tableContext.Provider>
  )
}

interface TheadProps
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<'thead'> {
  variant: 'default' | 'light' | 'dark'
}

const theadContext = createContext<{
  variant: TheadProps['variant']
}>({
  variant: 'default',
})
Table.Thead = function Thead({ className, ...props }: TheadProps) {
  return (
    <theadContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        variant: props.variant,
      }}
    >
      <thead
        className={twMerge([
          props.variant === 'light' && 'bg-slate-200/60 dark:bg-slate-200',
          props.variant === 'dark' && 'bg-dark text-white dark:bg-black/30',
          className,
        ])}
        {...props}
      >
        {props.children}
      </thead>
    </theadContext.Provider>
  )
}

type TbodyProps = React.PropsWithChildren<
  React.ComponentPropsWithoutRef<'tbody'>
>

Table.Tbody = function Tbody({ className, ...props }: TbodyProps) {
  return <thead className={className}>{props.children}</thead>
}

type TrProps = React.PropsWithChildren & React.ComponentPropsWithoutRef<'tr'>

Table.Tr = function Tr({ className, ...props }: TrProps) {
  const table = useContext(tableContext)
  return (
    <tr
      className={twMerge([
        // table.hover &&
        //   '[&:hover_td]:bg-slate-100 [&:hover_td]:dark:bg-darkmode-300 [&:hover_td]:dark:bg-opacity-50',
        table.striped &&
          '[&:nth-of-type(odd)_td]:bg-slate-100 [&:nth-of-type(odd)_td]:dark:bg-darkmode-300 [&:nth-of-type(odd)_td]:dark:bg-opacity-50',
        className,
      ])}
      {...props}
    >
      {props.children}
    </tr>
  )
}

type ThProps = React.PropsWithChildren & React.ComponentPropsWithoutRef<'th'>

Table.Th = function Th({ className, ...props }: ThProps) {
  const table = useContext(tableContext)
  const thead = useContext(theadContext)
  return (
    <th
      className={twMerge([
        'border-b-2 px-5 py-3 font-medium dark:border-darkmode-300 ',
        thead.variant === 'light' && 'border-b-0 text-slate-700',
        thead.variant === 'dark' && 'border-b-0',
        table.dark && 'border-slate-600 dark:border-darkmode-300',
        table.bordered && 'border-l border-r border-t',
        table.sm && 'px-4 py-2',
        'text-left',
        className,
      ])}
      {...props}
    >
      {props.children}
    </th>
  )
}

type TdProps = React.PropsWithChildren & React.ComponentPropsWithoutRef<'td'>

Table.Td = function Td({ className, ...props }: TdProps) {
  const table = useContext(tableContext)
  return (
    <td
      className={twMerge([
        'border-b px-5 py-3 dark:border-darkmode-300 text-left', 
        table.dark && 'border-slate-600 dark:border-darkmode-300',
        table.bordered && 'border-l border-r border-t',
        table.sm && 'px-4 py-2',
        className,
      ])}
      {...props}
    >
      {props.children}
    </td>
  )
}


export default Table

Table.defaultProps = {
  dark: false,
  bordered: false,
  hover: true,
  striped: false,
  sm: true,
}
