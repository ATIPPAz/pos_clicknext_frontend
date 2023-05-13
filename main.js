function openDialog(id) {
  const modal = document.getElementById(id)
  modal.style.display = 'block'
}
function onDialogClose(id) {
  const modal = document.getElementById(id)
  modal.style.display = 'none'
}
function onDialogCloseAndClear(idInput, idDialog, value = null) {
  const modal = document.getElementById(idDialog)
  modal.style.display = 'none'
  const input = document.getElementById(idInput)
  input.value = value ?? ''
}

function addDataInTable(tableId, data = [], action = true) {
  const table = document.getElementById(tableId)
  if (data.length > 0) {
    const rowOutput = []
    data.forEach((row) => {
      const newrow = table.insertRow(-1)
      let idCell = 0
      for (const key in row) {
        const newcell = newrow.insertCell(idCell)
        newcell.className = 'th'
        newcell.innerHTML = row[key]
        idCell++
      }
      if (action) {
        const newcell = newrow.insertCell(idCell)
        newcell.className = 'th'
        newcell.innerHTML = 'actionSlot'
      }
      rowOutput.push(newrow)
    })
    return { row: rowOutput, lenghtRow: table.rows.length }
  } else {
    if (table.rows.length > 1) {
      for (let index = table.rows.length; index > 1; index--) {
        table.deleteRow(table.rows.length - 1)
      }
    }
    return { row: [], lenghtRow: 0 }
  }
}

export { addDataInTable, openDialog, onDialogClose, onDialogCloseAndClear }
