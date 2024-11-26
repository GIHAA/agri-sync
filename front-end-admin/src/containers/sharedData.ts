import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import { NotificationTypes } from '../constants'

import useLocalStorage from '../hooks/useLocalStorage'
import { LocalStorageDarkMode } from '../interfaces'

interface NotificationProps {
  title?: string
  message?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any
  type: string
}

function useSharedDataHook() {
  const [localStorageDarkMode, setLocalStorageDarkMode] = useLocalStorage(
    'darkMode',
    false
  )
  const [slideOverPreview, setSlideOverPreview] = useState(false)
  const [notification, setNotification] = useState<NotificationProps>({
    title: '',
    message: '',
    icon: undefined,
    type: NotificationTypes.ERROR,
  })

  /* Dark Mode */
  const switchMode = () => {
    setLocalStorageDarkMode(
      (prevLocalStorageDarkMode: LocalStorageDarkMode) => {
        return !prevLocalStorageDarkMode
      }
    )
  }

  useEffect(() => {
    const setDarkModeClass = () => {
      const el = document.querySelectorAll('html')[0]
      if (localStorageDarkMode) {
        el.classList.add('dark')
      } else {
        el.classList.remove('dark')
      }
    }
    setDarkModeClass()
  }, [localStorageDarkMode])

  /* Slide over */
  const handleSlider = () => {
    setSlideOverPreview((pevSlideOverPreview) => !pevSlideOverPreview)
  }

  return {
    localStorageDarkMode,
    switchMode,
    slideOverPreview,
    handleSlider,
    notification,
    setNotification,
  }
}

export default createContainer(useSharedDataHook)
