import { initLoader } from '../../plugins/loading.js'
import { openDialog, closeDialog } from '../../main.js'
import { initToast } from '../../plugins/toast.js'
import { statusCode as status } from '../../plugins/statusCode.js'
import * as ItemApi from '../../plugins/api/itemApi.js'
import * as UnitApi from '../../plugins/api/unitApi.js'

const body = document.getElementById('bodyPage')
const templateNoData = document.getElementById('templateNoData')
const buttonSaveChange = document.getElementById('add')

const templateRowTable = document.getElementById('tableRow')
const tableBody = document.getElementById('tableBody')
const priceEdit = document.getElementById('itemPrice')
const nameEdit = document.getElementById('itemName')
const itemCodeEdit = document.getElementById('itemCode')
const unitEdit = document.getElementById('itemDropdown')
const title = document.getElementById('titleDialog')
const openDialogButton = document.getElementById('opendialogbutton')
const buttonCloseDialog = document.getElementById('closeDialogButton')

const loader = initLoader(body)
const Toast = initToast(body)

let type = 'add'
let editId = null

const priceValue = {
  get value() {
    return priceEdit.value
  },
  set value(x) {
    priceEdit.value = x
  },
}

const nameValue = {
  get value() {
    return nameEdit.value
  },
  set value(x) {
    nameEdit.value = x
  },
}

const idValue = {
  get value() {
    return itemCodeEdit.value
  },
  set value(x) {
    itemCodeEdit.value = x
  },
}

const unitValue = {
  get value() {
    return unitEdit.value
  },
  set value(x) {
    unitEdit.value = x
  },
}

const titleDialog = {
  get value() {
    return title.textContent
  },
  set value(x) {
    title.textContent = x
  },
}

async function openDialogWithType(itemData) {
  loader.setLoadingOn()
  const res = await getUnitData()
  const isEdit = itemData ? true : false
  let itemDataDropdown = []
  if (isEdit) {
    itemCodeEdit.disabled = true
    nameValue.value = itemData.name
    idValue.value = itemData.code
    priceValue.value = itemData.price
    itemDataDropdown = itemData.unit
    titleDialog.value = 'แก้ไขสินค้า'
    itemCodeEdit.disabled = true
    type = 'edit'
  } else {
    type = 'add'
    titleDialog.value = 'เพิ่มสินค้า'
    itemCodeEdit.disabled = false
    nameValue.value = ''
    idValue.value = ''
    priceValue.value = '0'
    itemDataDropdown = res.length > 0 ? res[0].id : undefined
  }

  setDropdownOption(res, itemDataDropdown)
  loader.setLoadingOff()
  openDialog('dialogItem')
}
function saveChange() {
  if (type === 'add') {
    saveNewItem()
  } else {
    saveUpdate()
  }
}

async function saveUpdate() {
  if (
    unitValue.value === '' ||
    nameValue.value === '' ||
    priceValue.value === ''
  ) {
    Toast.error('ไม่สำเร็จ', 'กรุณากรอกให้ครบทุกช่อง')
    return
  }
  loader.setLoadingOn()
  const updateBody = {
    itemId: +editId,
    itemName: nameValue.value,
    itemPrice: +priceValue.value,
    unitId: +unitValue.value,
  }
  const res = await ItemApi.updateItem(updateBody)
  if (res.statusCode === status.updateSuccess) {
    Toast.success('สำเร็จ', 'เพิ่มข้อมูลไอเทมเรียบร้อย')
    await loadTable()
  }
  closeDialog('dialogItem')
  loader.setLoadingOff()
}

async function saveNewItem() {
  loader.setLoadingOn()
  if (
    unitValue.value == '' ||
    idValue.value == '' ||
    nameValue.value == '' ||
    priceValue.value == ''
  ) {
    Toast.error('ไม่สำเร็จ', 'กรุณากรอกให้ครบทุกช่อง')
  } else {
    const itemPost = {
      itemCode: idValue.value,
      itemName: nameValue.value,
      itemPrice: priceValue.value,
      unitId: unitValue.value,
    }
    const res = await ItemApi.createItem(itemPost)
    if (res.statusCode === status.createSuccess) {
      Toast.success('สำเร็จ', `เพิ่มข้อมูลไอเทม (${itemPost.itemName}) สำเร็จ `)
      await loadTable()
    } else {
      Toast.error('ไม่สำเร็จ', 'เพิ่มไม่สำเร็จ เกิดข้อผิดพลาด')
    }
    idValue.value = ''
    nameValue.value = ''
    unitValue.value = '3'
    priceValue.value = 0
    closeDialog('dialogItem')
    loader.setLoadingOff()
  }
}
async function getUnitData() {
  const { statusCode, data } = await UnitApi.getUnit()
  if (statusCode === status.getSuccess) {
    return data.map((e) => {
      return {
        id: e.unitId,
        value: e.unitName,
      }
    })
  }
  return []
}
async function getItemData() {
  const { statusCode, data } = await ItemApi.getItem()
  if (statusCode === status.getSuccess) {
    return data.map((e) => {
      return {
        itemId: e.itemId,
        itemCode: e.itemCode,
        itemName: e.itemName,
        unitName: e.unitName,
        itemPrice: e.itemPrice,
        unitId: e.unitId,
      }
    })
  }
  return []
}
function setDropdownOption(itemUnit, defaultValue) {
  const dropdown = document.getElementById('itemDropdown')
  dropdown.innerHTML = ''
  itemUnit.forEach((element, i) => {
    const option = document.createElement('option')
    option.text = element.value
    option.value = element.id
    dropdown.add(option, -1)
  })
  if (itemUnit.length > 0) {
    unitValue.value = defaultValue
  }
}
function createRow(index, item) {
  const tr = document.createElement('tr')
  const clone = templateRowTable.content.cloneNode(true)
  tr.appendChild(clone)
  const rowNumber = tr.querySelector('.rowNumber')
  const rowItemCode = tr.querySelector('.rowItemCode')
  const rowItemName = tr.querySelector('.rowItemName')
  const rowItemUnit = tr.querySelector('.rowItemUnit')
  const rowItemPrice = tr.querySelector('.rowItemPrice')
  const editButton = tr.querySelector('.editButton')
  const deleteButton = tr.querySelector('.deleteButton')
  editButton.addEventListener('click', async () => {
    editId = item.itemId
    await openDialogWithType({
      code: item.itemCode,
      name: item.itemName,
      unit: item.unitId,
      price: item.itemPrice,
    })
  })
  deleteButton.addEventListener('click', async () => {
    loader.setLoadingOn()
    const { statusCode } = await ItemApi.deleteItem(item.itemId)
    if (statusCode === status.deleteSuccess) {
      Toast.success('สำเร็จ', 'ลบสำเร็จ')
      await loadTable()
    } else {
      Toast.error('ไม่สำเร็จ', 'เกิดข้อผิดพลาด')
    }
    loader.setLoadingOff()
  })
  rowNumber.textContent = index + 1
  rowItemCode.textContent = item.itemCode
  rowItemName.textContent = item.itemName
  rowItemUnit.textContent = item.unitName
  rowItemPrice.textContent = item.itemPrice
  return tr
}
async function loadTable() {
  tableBody.innerHTML = ''
  const items = await getItemData()
  if (items.length === 0) {
    const row = templateNoData.content.cloneNode(true)
    tableBody.appendChild(row)
  } else {
    items.forEach((item, index) => {
      const row = createRow(index, item)
      tableBody.appendChild(row)
    })
  }
}
async function onPageLoad() {
  loader.setLoadingOn()
  buttonSaveChange.addEventListener('click', saveChange)
  buttonCloseDialog.addEventListener('click', () => closeDialog('dialogItem'))
  openDialogButton.addEventListener('click', () =>
    openDialogWithType(undefined),
  )
  await loadTable()
  loader.setLoadingOff()
}

onPageLoad()
