export function initLoader(loadingElement, bodyElement) {
  return {
    setLoadingOn() {
      bodyElement.classList.replace('d-block', 'd-none')
      loadingElement.classList.replace('d-none', 'd-flex')
    },
    setLoadingOff() {
      bodyElement.classList.replace('d-none', 'd-block')
      loadingElement.classList.replace('d-flex', 'd-none')
    },
  }
}
