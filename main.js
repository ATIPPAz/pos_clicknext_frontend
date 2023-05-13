function openDialog(id) {
  const modal = document.getElementById(id)
  modal.style.display = 'block'
}
function onDialogClose(id) {
  const modal = document.getElementById(id);
  modal.style.display = "none";
}

export { openDialog, onDialogClose };
