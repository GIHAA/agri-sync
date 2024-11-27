import { createRef, useEffect } from 'react'
import agrisyncpy, {
  Props,
  roundArrow,
  animateFill as animateFillPlugin,
} from 'agrisyncpy.js'

interface MainProps {
  to: string
  getRef?: (el: HTMLElement | null) => HTMLElement
  options?: Props
}

type AgrisyncpyContentProps = React.PropsWithChildren<MainProps> &
  Omit<React.ComponentPropsWithoutRef<'div'>, keyof MainProps>

const init = (el: HTMLElement, props: AgrisyncpyContentProps) => {
  agrisyncpy(`[data-toolagrisync="${props.to}"]`, {
    plugins: [animateFillPlugin],
    content: el,
    allowHTML: true,
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
    theme: 'light',
    trigger: 'click',
    ...props.options,
  })
}

function AgrisyncpyContent(props: AgrisyncpyContentProps) {
  const agrisyncpyRef = createRef<HTMLDivElement>()
  const { to, options, getRef, children, ...computedProps } = props

  useEffect(() => {
    if (getRef) {
      getRef(agrisyncpyRef.current)
    }

    if (agrisyncpyRef.current !== null) {
      init(agrisyncpyRef.current, props)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children])

  return (
    <div {...computedProps} ref={agrisyncpyRef}>
      {children}
    </div>
  )
}

export default AgrisyncpyContent
