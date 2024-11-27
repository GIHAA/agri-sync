import Toastify from 'toastify-js'
// eslint-disable-next-line import/no-cycle
import { NotificationElement, NotificationProps } from './index'

const toastifyClass = `_${Math.random().toString(36).substr(2, 9)}`

const init = (el: NotificationElement, props: NotificationProps) => {
  // eslint-disable-next-line no-param-reassign
  el.showToast = () => {
    const clonedEl = el.cloneNode(true) as NotificationElement
    clonedEl.classList.remove('hidden')
    clonedEl.classList.add(toastifyClass)
    clonedEl.toastify = Toastify({
      duration: -1,
      newWindow: true,
      close: true,
      gravity: 'top',
      position: 'right',
      stopOnFocus: true,
      ...props.options,
      node: clonedEl,
    })
    clonedEl.toastify.showToast()
    clonedEl
      .querySelectorAll("[data-dismiss='notification']")
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .forEach(function dismss(el) {
        el.addEventListener('click', function hide() {
          clonedEl.toastify.hideToast()
        })
      })

    // eslint-disable-next-line no-param-reassign
    el.hideToast = () => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      document.querySelectorAll(`.${toastifyClass}`).forEach(function hide(el) {
        const toastifyEl = el as NotificationElement
        toastifyEl.toastify.hideToast()
      })
    }
  }
}

const reInit = (el: NotificationElement) => {
  const wrapperEl = document.querySelectorAll(`.${toastifyClass}`)[0]
  if (wrapperEl) {
    wrapperEl.innerHTML = el.innerHTML
  }
}

export { init, reInit }
