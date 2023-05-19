function openDialog(id) {
  const modal = document.getElementById(id)
  modal.style.display = 'block'
}
function closeDialog(id) {
  const modal = document.getElementById(id)
  modal.style.display = 'none'
}

export { openDialog, closeDialog }
