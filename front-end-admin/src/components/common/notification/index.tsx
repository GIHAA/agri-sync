/* eslint-disable react/require-default-props */
/* eslint-disable react/default-props-match-prop-types */
import { useRef, createRef, useEffect } from 'react'
import Toastify, { Options } from 'toastify-js'
import clsx from 'clsx'
// eslint-disable-next-line import/no-cycle
import { init, reInit } from './notification'
import Lucide from '../lucide'
import SharedDataContainer from '../../../containers/sharedData'
import { NotificationTypes } from '../../../constants'

export interface NotificationElement extends HTMLDivElement {
  toastify: ReturnType<typeof Toastify>
  showToast: () => void
  hideToast: () => void
}

export interface NotificationProps
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<'div'> {
  options: Options
  getRef: (el: NotificationElement) => void
}

function Notification(props: NotificationProps) {
  const initialRender = useRef(true)
  const toastifyRef = createRef<NotificationElement>()

  const { notification } = SharedDataContainer.useContainer()

  const {
    options,
    getRef,
    onCompositionStart,
    children,
    className,
    ...computedProps
  } = props

  useEffect(() => {
    if (toastifyRef.current) {
      if (initialRender.current) {
        getRef(toastifyRef.current)
        init(toastifyRef.current, props)
        initialRender.current = false
      } else {
        reInit(toastifyRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, children])

  const notificationColor = (type: string) => {
    switch (type) {
      case NotificationTypes.SUCCESS:
        return 'text-success'
      case NotificationTypes.WARNING:
        return 'text-warning'
      case NotificationTypes.ERROR:
        return 'text-danger'
      default:
        return 'text-danger'
    }
  }

  return (
    <div
      {...computedProps}
      className={clsx([
        'hidden rounded-lg border border-slate-200/60 bg-white py-5 pl-5 pr-14 shadow-xl dark:border-darkmode-600 dark:bg-darkmode-600 dark:text-slate-300',
        className,
      ])}
      id="notification-content"
      ref={toastifyRef}
    >
      <div className="flex">
        {notification?.icon ? (
          <Lucide
            icon={notification?.icon}
            className={notificationColor(notification.type)}
          />
        ) : (
          ''
        )}
        <div className="ml-4 mr-4">
          <div className="font-medium">{notification.title}</div>
          <div className="mt-1 text-slate-500">{notification.message}</div>
        </div>
      </div>
    </div>
  )
}

Notification.defaultProps = {
  className: '',
  options: {},
  getRef: () => {},
}

export default Notification
