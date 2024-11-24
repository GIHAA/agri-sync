/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import clsx from 'clsx'
import { selectDarkMode, setDarkMode } from '../../stores/darkModeSlice'
import { useAppSelector, useAppDispatch } from '../../stores/hooks'

function Main() {
  const dispatch = useAppDispatch()
  const darkMode = useAppSelector(selectDarkMode)

  const setDarkModeClass = () => {
    const el = document.querySelectorAll('html')[0]
    darkMode ? el.classList.add('dark') : el.classList.remove('dark')
  }

  const switchMode = () => {
    dispatch(setDarkMode(!darkMode))
    localStorage.setItem('darkMode', (!darkMode).toString())
    setDarkModeClass()
  }

  setDarkModeClass()

  return (
    <>
      {/* BEGIN: Dark Mode Switcher */}
      <div
        className="box fixed bottom-0 right-0 z-50 mb-10 mr-10 flex h-12 w-40 cursor-pointer items-center justify-center rounded-full border shadow-md"
        onClick={switchMode}
      >
        <div className="mr-4 text-slate-600 dark:text-slate-200">Dark Mode</div>
        <div
          className={clsx([
            'relative h-[24px] w-[38px] cursor-pointer rounded-full border p-px outline-none',
            "before:absolute before:inset-y-0 before:my-auto before:h-[22px] before:w-[22px] before:rounded-full before:shadow-[1px_1px_3px_rgba(0,0,0,0.25)] before:transition-all before:duration-200 before:content-['']",
            {
              'border-primary bg-primary': darkMode,
              'before:ml-[13px] before:bg-white': darkMode,
            },
          ])}
        />
      </div>
      {/* END: Dark Mode Switcher */}
    </>
  )
}

export default Main
