import * as lucideIcons from 'lucide-react'
import clsx from 'clsx'

export const { createReactComponent, ...icons } = lucideIcons

type Icon = keyof typeof icons

export interface LucideProps extends React.ComponentPropsWithoutRef<'svg'> {
  icon: Icon
  title?: string
  stroke?: string
}

function Lucide(props: LucideProps) {
  const { icon, className, stroke, ...computedProps } = props
  const Component = lucideIcons[icon]
  return <Component {...computedProps} className={clsx([stroke, className])} />
}

export default Lucide

Lucide.defaultProps = {
  title: '',
  stroke: 'stroke-1.5',
}
