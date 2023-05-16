export function initLoader(bodyElement) {
  let loader = null
  const page = document.getElementsByTagName('body')[0]
  loader = document.createElement('div')
  loader.id = 'loading'
  loader.classList.add('loader', 'd-none')
  page.appendChild(loader)

  function setLoadingOn() {
    bodyElement.classList.replace('d-block', 'd-none')
    loader.classList.replace('d-none', 'd-flex')
  }
  function setLoadingOff() {
    bodyElement.classList.replace('d-none', 'd-block')
    loader.classList.replace('d-flex', 'd-none')
  }

  return {
    setLoadingOn,
    setLoadingOff,
  }
}
