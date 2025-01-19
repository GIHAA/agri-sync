import { createRef, useEffect } from 'react'
import tippy, {
  Props,
  roundArrow,
  animateFill as animateFillPlugin,
} from 'tippy.js'

interface MainProps {
  to: string
  getRef?: (el: HTMLElement | null) => HTMLElement
  options?: Props
}

type TippyContentProps = React.PropsWithChildren<MainProps> &
  Omit<React.ComponentPropsWithoutRef<'div'>, keyof MainProps>

const init = (el: HTMLElement, props: TippyContentProps) => {
  tippy(`[data-tooltip="${props.to}"]`, {
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

function TippyContent(props: TippyContentProps) {
  const tippyRef = createRef<HTMLDivElement>()
  const { to, options, getRef, children, ...computedProps } = props

  useEffect(() => {
    if (getRef) {
      getRef(tippyRef.current)
    }

    if (tippyRef.current !== null) {
      init(tippyRef.current, props)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children])

  return (
    <div {...computedProps} ref={tippyRef}>
      {children}
    </div>
  )
}

export default TippyContent
