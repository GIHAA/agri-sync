/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/require-default-props */
import * as lucideIcons from 'lucide-react'
import clsx from 'clsx'

export const { createReactComponent, ...icons } = lucideIcons

type icon = keyof typeof icons

export interface LucideProps extends React.ComponentPropsWithoutRef<'svg'> {
  icon: icon
  title?: string
}

function Lucide(props: LucideProps) {
  const { icon, className, ...computedProps } = props
  const Component = lucideIcons[props.icon]
  return (
    <Component
      {...computedProps}
      className={clsx(['stroke-1.5', props.className])}
    />
  )
}

export default Lucide
