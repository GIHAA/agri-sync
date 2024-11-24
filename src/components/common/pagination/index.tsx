import { twMerge } from 'tailwind-merge'
import Button from '../button'

type PaginationProps = React.PropsWithChildren &
  React.ComponentPropsWithoutRef<'nav'>

function Pagination({ className, children }: PaginationProps) {
  return (
    <nav className={className}>
      <ul className="mr-0 flex w-full sm:mr-auto sm:w-auto">{children}</ul>
    </nav>
  )
}

interface LinkProps
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<'li'> {
  active?: boolean
}

Pagination.Link = function ({ className, active, children }: LinkProps) {
  return (
    <li className="flex-1 sm:flex-initial">
      <Button
        as="a"
        className={twMerge([
          'flex min-w-0 items-center justify-center border-transparent px-1 font-normal text-slate-800 shadow-none dark:text-slate-300 sm:mr-2 sm:min-w-[40px] sm:px-3',
          active && 'box font-medium dark:bg-darkmode-400',
          className,
        ])}
      >
        {children}
      </Button>
    </li>
  )
}

export default Pagination
