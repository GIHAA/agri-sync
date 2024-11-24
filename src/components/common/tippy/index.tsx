import { createRef, useEffect } from 'react'
import tippy, {
  PopperElement,
  Props,
  roundArrow,
  animateFill as animateFillPlugin,
} from 'tippy.js'
import clsx from 'clsx'

type TippyProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
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
  props: TippyProps<C>
) => {
  tippy(el, {
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

function Tippy<C extends React.ElementType = 'span'>(props: TippyProps<C>) {
  const tippyRef = createRef<PopperElement>()

  const {
    content,
    as,
    options,
    getRef,
    className,
    children,
    ...computedProps
  } = props

  const Component = as || 'span'

  useEffect(() => {
    if (getRef) {
      getRef(tippyRef.current)
    }

    if (tippyRef.current !== null) {
      init<C>(tippyRef.current, props)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content])

  return (
    <Component
      ref={tippyRef}
      className={clsx(['cursor-pointer', className])}
      {...computedProps}
    >
      {children}
    </Component>
  )
}

export default Tippy
