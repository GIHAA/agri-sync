import { createRef, useEffect } from 'react'
import agrisyncpy, {
  PopperElement,
  Props,
  roundArrow,
  animateFill as animateFillPlugin,
} from 'agrisyncpy.js'
import clsx from 'clsx'

type AgrisyncpyProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  {
    getRef?: (el: PopperElement | null) => void
    content: string
    as?: C
    options?: Partial<Props>
  }
>

const init = <C extends React.ElementType>(
  el: PopperElement,
  props: AgrisyncpyProps<C>
) => {
  agrisyncpy(el, {
    plugins: [animateFillPlugin],
    content: props.content,
    arrow: roundArrow,
    popperOptions: {
      modifiers: [
        {
          name: 'preventOverflow',
          options: {
            rootBoundary: 'viewport',
          },
        },
      ],
    },
    animateFill: false,
    animation: 'shift-away',
    ...props.options,
  })
}

function Agrisyncpy<C extends React.ElementType = 'span'>(props: AgrisyncpyProps<C>) {
  const agrisyncpyRef = createRef<PopperElement>()
  const Component = props.as || 'span'

  useEffect(() => {
    if (props.getRef) {
      props.getRef && props.getRef(agrisyncpyRef.current)
    }

    if (agrisyncpyRef.current !== null) {
      init<C>(agrisyncpyRef.current, props)
    }
  }, [props.content])

  const { content, as, options, getRef, className, ...computedProps } = props
  return (
    <Component
      ref={agrisyncpyRef}
      className={clsx(['cursor-pointer', className])}
      {...computedProps}
    >
      {props.children}
    </Component>
  )
}

export default Agrisyncpy
