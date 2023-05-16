export function initToast(page) {
  let toast = null
  let toastHeaderText = null
  let toastColor = null
  let toastContent = null

  toast = document.createElement('div')
  toast.classList.add('d-none')
  toast.id = 'toast'
  const closeBtn = document.createElement('span')
  closeBtn.classList.add('close')
  closeBtn.id = 'toast-close'
  closeBtn.innerHTML = '&times;'
  closeBtn.addEventListener('click', closeToast)
  const toastHeader = document.createElement('div')
  toastHeader.classList.add('toast-header')
  toastColor = document.createElement('div')
  toastColor.id = 'toast-color'
  toastHeaderText = document.createElement('p')
  toastHeaderText.style.margin = '0px'
  toastHeaderText.id = 'toast-header-text'
  toastHeader.appendChild(toastColor)
  toastHeader.appendChild(toastHeaderText)
  toastContent = document.createElement('div')
  toastContent.classList.add('toast-content')
  toastContent.id = 'toast-content'
  toast.appendChild(closeBtn)
  toast.appendChild(toastHeader)
  toast.appendChild(toastContent)
  page.appendChild(toast)

  function openToast() {
    toast.classList.replace('d-none', 'd-block')
  }

  function success(header = '', content = '') {
    toastColor.style.backgroundColor = 'green'
    toastHeaderText.textContent = 'สำเร็จ'
    toastContent.textContent = 'ดำเนินการสำเร็จ'
    if (header || header != '') {
      toastHeaderText.textContent = header
    }
    if (content || content != '') {
      toastContent.textContent = content
    }
    openToast()
    setTimeout(closeToast, 3000)
  }
  function error(header = '', content = '') {
    toastColor.style.backgroundColor = 'red'
    toastHeaderText.textContent = 'ไม่สำเร็จ'
    toastContent.textContent = 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
    if (header || header != '') {
      toastHeaderText.textContent = header
    }
    if (content || content != '') {
      toastContent.textContent = content
    }
    openToast()
    setTimeout(closeToast, 3000)
  }
  function info(header = '', content = '') {
    toastColor.style.backgroundColor = 'blue'
    toastHeaderText.textContent = 'แจ้งเตือน'
    toastContent.textContent = 'แจ้งเตือน'
    if (header || header != '') {
      toastHeaderText.textContent = header
    }
    if (content || content != '') {
      toastContent.textContent = content
    }
    openToast()
    setTimeout(closeToast, 3000)
  }
  function closeToast() {
    toast.classList.replace('d-block', 'd-none')
  }
  return {
    success,
    error,
    info,
    closeToast,
  }
}
