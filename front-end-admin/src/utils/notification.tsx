import Toastify from 'toastify-js'

function Toast() {
  setTimeout(() => {
    const failedEl = document
      .querySelectorAll('#notification-content')[0]
      .cloneNode(true) as HTMLElement
    failedEl.classList.remove('hidden')

    Toastify({
      node: failedEl,
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: 'top',
      position: 'right',
      stopOnFocus: true,
    }).showToast()
  }, 500)
}

export default Toast
