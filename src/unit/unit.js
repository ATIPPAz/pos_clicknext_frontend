import { initLoader } from '../../plugins/loading.js'
import { openDialog, closeDialog } from '../../main.js'
import { initToast } from '../../plugins/toast.js'
import * as UnitApi from '../../plugins/api/unitApi.js'

const buttonSaveChange = document.getElementById('buttonSaveChange')
const templateRowTable = document.getElementById('templateRowTable')
const templateNoData = document.getElementById('templateNoData')
const closeDialogBtn = document.getElementById('closeDialog')
const addButton = document.getElementById('addButton')
const tableBody = document.getElementById('tableRow')
const _unitName = document.getElementById('unitName')
const body = document.getElementById('bodyPage')
const _title = document.getElementById('titleDialog')
const close = document.getElementById('close')

const loader = initLoader(body)
const toast = initToast(body)

const unitName = {
  get value() {
    return _unitName.value
  },
  set value(x) {
    _unitName.value = x
  },
}
let typeDialog

let currentUnitId = null

function setDialog(x) {
  if (x === 'add') {
    _title.textContent = 'เพิ่มหน่วยนับ'
  } else {
    _title.textContent = 'แก้ไขหน่วยนับ'
  }
  typeDialog = x
}
async function saveUpdate() {
  if (unitName.value == '') {
    toast.error('ข้อมูลไม่ครบที่กำหนด', 'กรุณากรอกชื่อหน่วย')
    return
  }
  loader.setLoadingOn()
  const { statusCode } = await UnitApi.updateUnit({
    unitId: +currentUnitId,
    unitName: unitName.value,
  })
  if (statusCode != 204) {
    toast.error('ไม่สำเร็จ', 'เกิดข้อผิดพลาด')
  } else {
    toast.success('แก้ไขสำเร็จ', 'แก้ไขหน่วยนับสำเร็จ')
    closeDialog('dialogUnit')
    unitName.value = ''
    await loadTable()
  }
  loader.setLoadingOff()
}
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
function saveChange() {
  if (typeDialog === 'add') {
    saveNewUnit()
  } else {
    saveUpdate()
  }
}
async function saveNewUnit() {
  if (unitName.value == '') {
    toast.error('ข้อมูลไม่ครบที่กำหนด', 'กรุณากรอกชื่อหน่วย')
    return
  }
  loader.setLoadingOn()
  const { statusCode } = await UnitApi.createUnit({
    unitName: unitName.value,
  })
  if (statusCode != 201) {
    toast.error('ไม่สำเร็จ', 'เกิดข้อผิดพลาด')
  } else {
    toast.success('เพิ่มสำเร็จ', 'เพิ่มหน่วยนับสำเร็จ')
    closeDialog('dialogUnit')
    unitName.value = ''
    await loadTable()
  }
  loader.setLoadingOff()
}
function openAddUnitDialog() {
  unitName.value = ''
  setDialog('add')
  openDialog('dialogUnit')
}
function closeDialogUnit() {
  closeDialog('dialogUnit')
  unitName.value = ''
}
async function loadTable() {
  loader.setLoadingOn()
  tableBody.innerHTML = ''
  const unitItems = await getData()
  if (unitItems.length === 0) {
    unitItems.push(undefined)
  }
  unitItems.forEach((unit, index) => {
    const row = createRow(index, unit)
    tableBody.appendChild(row)
  })
  loader.setLoadingOff()
}
function createRow(index = undefined, item = undefined) {
  if (!item) {
    return templateNoData.content.cloneNode(true)
  }
  const tr = document.createElement('tr')
  const clone = templateRowTable.content.cloneNode(true)
  tr.appendChild(clone)
  const rowNumber = tr.querySelector('.rowNumber')
  rowNumber.textContent = index + 1
  const rowUnitName = tr.querySelector('.rowUnitName')
  const editButton = tr.querySelector('.editButton')
  const deleteButton = tr.querySelector('.deleteButton')
  rowUnitName.textContent = item.unitName
  editButton.addEventListener('click', () => {
    setDialog('edit')
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
window.addEventListener('DOMContentLoaded', async () => {
  closeDialogBtn.addEventListener('click', () => closeDialogUnit())
  close.addEventListener('click', () => closeDialogUnit())
  addButton.addEventListener('click', () => openAddUnitDialog())
  buttonSaveChange.addEventListener('click', () => saveChange())
  await loadTable()
})
