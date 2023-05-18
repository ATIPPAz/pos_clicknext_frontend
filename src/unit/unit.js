import { initLoader } from '../../plugins/loading.js'
const body = document.getElementById('bodyPage')
const loader = initLoader(body)
import { openDialog, onDialogClose } from '../../main.js'
import * as UnitApi from '../../plugins/api/unitApi.js'
import { initToast } from '../../plugins/toast.js'
const addButton = document.getElementById('addButton')
const buttonSaveChange = document.getElementById('buttonSaveChange')
const buttonEditChange = document.getElementById('buttonEditChange')
const closeDialog = document.getElementById('closeDialog')
const close = document.getElementById('close')
const templateRowTable = document.getElementById('templateRowTable')
const tableBody = document.getElementById('tableRow')
const _unitName = document.getElementById('unitName')
const _title = document.getElementById('titleDialog')
const templateNoData = document.getElementById('templateNoData')

const toast = initToast(body)

const unitName = {
  get value() {
    return _unitName.value
  },
  set value(x) {
    _unitName.value = x
  },
}

const setDialog = {
  get value() {
    return _title.textContent
  },
  set value(x) {
    if (x == 'add') {
      _title.textContent = 'เพิ่มหน่วยนับ'
      buttonSaveChange.style.display = 'inline-block'
      buttonEditChange.style.display = 'none'
    } else {
      _title.textContent = 'แก้ไขหน่วยนับ'
      buttonSaveChange.style.display = 'none'
      buttonEditChange.style.display = 'inline-block'
    }
  },
}

let currentUnitId = null
async function editUnit() {
  loader.setLoadingOn()
  if (unitName.value != '') {
    const { statusCode } = await UnitApi.updateUnit({
      unitId: +currentUnitId,
      unitName: unitName.value,
    })
    if (statusCode != 204) {
      toast.error('ไม่สำเร็จ', 'เกิดข้อผิดพลาด')
    } else {
      toast.success('แก้ไขสำเร็จ', 'แก้ไขหน่วยนับสำเร็จ')
      onDialogClose('dialogUnit')
      unitName.value = ''
      await loadTable()
    }
  } else {
    toast.error('ข้อมูลไม่ครบที่กำหนด', 'กรุณากรอกชื่อหน่วย')
  }
  loader.setLoadingOff()
}

async function deleteUnit(id) {}
async function getData() {
  const { statusCode, data } = await UnitApi.getUnit()
  if (statusCode === 200) {
    if (data.length <= 0) return []
    return data.map((e) => {
      return {
        unitId: e.unitId,
        unitName: e.unitName,
      }
    })
  }
  return []
}
async function addNewUnit() {
  loader.setLoadingOn()
  if (unitName.value != '') {
    const { statusCode } = await UnitApi.createUnit({
      unitName: unitName.value,
    })
    if (statusCode != 201) {
      toast.error('ไม่สำเร็จ', 'เกิดข้อผิดพลาด')
    } else {
      toast.success('เพิ่มสำเร็จ', 'เพิ่มหน่วยนับสำเร็จ')
      onDialogClose('dialogUnit')
      unitName.value = ''
      await loadTable()
    }
  } else {
    toast.error('ข้อมูลไม่ครบที่กำหนด', 'กรุณากรอกชื่อหน่วย')
  }
  loader.setLoadingOff()
}
// function setActionButton(row) {
//   row.row.forEach((element) => {
//     const id = element.cells[0].innerText
//     element.cells[2].innerHTML = `<div><button onclick="chageUnit('${id}')" >แก้ไข</button><button onclick="deleteUnit('${id}')">ลบ</button></div>`
//   })
// }
function openAddUnitDialog() {
  setDialog.value = 'add'
  openDialog('dialogUnit')
  unitName.value = ''
}
function closeDialogUnit() {
  unitName.value = ''
  onDialogClose('dialogUnit')
}
async function loadTable() {
  loader.setLoadingOn()
  tableBody.innerHTML = ''
  const unitItems = await getData()
  if (unitItems.length > 0) {
    unitItems.forEach((unit, index) => {
      const row = createRow(index, unit)
      tableBody.appendChild(row)
      // assignValue(row, unit)
    })
  } else {
    loadNodata()
  }

  loader.setLoadingOff()
}

function assignValue(tr, item) {}
function createRow(index, item) {
  const tr = document.createElement('tr')
  const clone = templateRowTable.content.cloneNode(true)
  // tr.dataset.counterIdx = index
  tr.appendChild(clone)
  const rowNumber = tr.querySelector('.rowNumber')
  rowNumber.textContent = index + 1
  const rowUnitName = tr.querySelector('.rowUnitName')
  const editButton = tr.querySelector('.editButton')
  const deleteButton = tr.querySelector('.deleteButton')
  // tr.dataset.rowUnitName = item.unitName
  // tr.dataset.unitId = item.unitId
  rowUnitName.textContent = item.unitName
  editButton.addEventListener('click', () => {
    setDialog.value = 'edit'
    unitName.value = item.unitName
    currentUnitId = item.unitId
    openDialog('dialogUnit')
  })
  deleteButton.addEventListener('click', async () => {
    loader.setLoadingOn()
    const { statusCode } = await UnitApi.deleteUnit(item.unitId)
    if (statusCode == 204) {
      toast.success('ลบสำเร็จ', 'ลบหน่วยนับสำเร็จ')
      await loadTable()
    } else {
      toast.error('ไม่สำเร็จ', 'เกิดข้อผิดพลาด')
    }
    loader.setLoadingOff()
  })
  return tr
}
function loadNodata() {
  const clone = templateNoData.content.cloneNode(true)
  tableBody.appendChild(clone)
}

window.addEventListener('DOMContentLoaded', async () => {
  closeDialog.addEventListener('click', () => closeDialogUnit())
  close.addEventListener('click', () => closeDialogUnit())
  addButton.addEventListener('click', () => openAddUnitDialog())
  buttonSaveChange.addEventListener('click', () => addNewUnit())
  buttonEditChange.addEventListener('click', () => editUnit())
  await loadTable()
})
