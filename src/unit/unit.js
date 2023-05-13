// import { onDialogCloseAndClear, addDataInTable } from '../../main.js'
import { openDialog, onDialogClose } from '../../main.js'
import { initLoader } from '../../plugins/loading.js'
import * as UnitApi from '../../plugins/api/unitApi.js'

const buttonSaveChange = document.getElementById('add')
const buttonEditChange = document.getElementById('edit')
const templateRowTable = document.getElementById('tableRow')
const tableBody = document.getElementById('tableBody')
const priceEdit = document.getElementById('itemPrice')
const nameEdit = document.getElementById('itemName')
const itemCodeEdit = document.getElementById('itemCode')
const unitEdit = document.getElementById('itemDropdown')
const title = document.getElementById('titleDialog')
const body = document.getElementById('bodyPage')
const loading = document.getElementById('loading')
const openDialogButton = document.getElementById('opendialogbutton')
const loader = initLoader(loading, body)

let unitItems = []
let idSelect = null
const editNewUnit = () => {
  const input = document.getElementById('unitEdit')
  if (input.value != '') {
    const table = document.getElementById('unitBody')
    table.rows[idSelect].cells[1].innerHTML = input.value
    onDialogCloseAndClear('unitEdit', 'dialogEditUnit')
  }
}

function chageUnit(idx) {
  openDialog('dialogEditUnit')
  const unitEdit = document.getElementById('unitEdit')
  const table = document.getElementById('unitBody')
  idSelect = idx
  unitEdit.value = table.rows[idSelect].cells[1].innerHTML
}
async function deleteUnit(id) {
  const unitBody = document.getElementById('unitBody')
  let idx = 0
  for (let index = 1; index < unitBody.rows.length; index++) {
    if (unitBody.rows[index].cells[0].innerHTML == id) {
      idx = index
    }
  }
  const res = await deleteRequest('unit/deleteUnit/', id)
  if (res) {
    document.getElementById('unitBody').deleteRow(idx)
  }
  setLoadingOn()
  await getData()
  addDataInTable('unitBody', [])
  const rows = addDataInTable('unitBody', unitItems)
  setActionButton(rows)
  setLoadingOff()
}
async function getData() {
  const { statusCode, data } = await UnitApi.getUnit()
  if (statusCode === 200) {
    return data.map((e) => {
      return {
        id: e.unitId,
        name: e.unitName,
      }
    })
  }
  return []
}
async function addNewUnit() {
  loader.setLoadingOn()
  // const unitBody = document.getElementById('unitBody')
  const input = document.getElementById('unit')
  if (input.value != '') {
    const res = await postRequest({ unitName: input.value }, 'unit/createUnit')
    if (res.unitId) {
      const unitNewItem = { id: res.unitId, name: res.unitName }
      unitItems.push(unitNewItem)
      addDataInTable('unitBody', [])
      const rows = addDataInTable('unitBody', unitItems)
      setActionButton(rows)
      onDialogClose('dialogAddUnit')
      input.value = ''
    }
  } else {
    alert('กรุณากรอกชื่อหน่วย')
  }
  loader.setLoadingOff()
}
function setActionButton(row) {
  row.row.forEach((element) => {
    const id = element.cells[0].innerText
    element.cells[2].innerHTML = `<div><button onclick="chageUnit('${id}')" >แก้ไข</button><button onclick="deleteUnit('${id}')">ลบ</button></div>`
  })
}
async function onMounted() {
  loader.setLoadingOn()
  await this.getData()
  const rows = addDataInTable('unitBody', unitItems)
  this.setActionButton(rows)
  loader.setLoadingOff()
}

onMounted()
