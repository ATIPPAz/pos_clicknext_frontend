import { openDialog, onDialogClose } from '../../main.js'
import { initLoader } from '../../plugins/loading.js'
import * as ItemApi from '../../plugins/api/itemApi.js'
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
const buttonCloseDialog = document.getElementById('closeDialogButton')

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

const typeDialog = {
  get value() {
    return type
  },
  set value(x) {
    if (x == 'add') {
      titleDialog.value = 'เพิ่มสินค้า'
      itemCodeEdit.disabled = false
    } else {
      titleDialog.value = 'แก้ไขสินค้า'
      itemCodeEdit.disabled = true
    }
    type = x
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
  if (isEdit) {
    itemCodeEdit.disabled = true
    typeDialog.value = 'edit'
    buttonSaveChange.style.display = 'none'
    buttonEditChange.style.display = 'inline-block'
    nameValue.value = itemData.name
    idValue.value = itemData.code
    priceValue.value = itemData.price
  } else {
    typeDialog.value = 'add'
    buttonSaveChange.style.display = 'inline-block'
    buttonEditChange.style.display = 'none'
    nameValue.value = ''
    idValue.value = ''
    priceValue.value = '0'
  }
  setDropdownOption(res, selectItemDropdown(res, isEdit, itemData))
  loader.setLoadingOff()
  openDialog('dialogItem')
}
const selectItemDropdown = (unitData, isEdit, itemData) => {
  if (isEdit) {
    return itemData.unit
  }
  return unitData.length > 0 ? unitData[0].id : undefined
}
const editItem = async () => {
  loader.setLoadingOn()
  if (
    unitValue.value === '' ||
    nameValue.value === '' ||
    priceValue.value === ''
  ) {
    alert('กรุณากรอกให้ครบทุกช่อง')
  } else {
    const updateBody = {
      itemId: +editId,
      itemName: nameValue.value,
      itemPrice: +priceValue.value,
      unitId: +unitValue.value,
    }
    const res = await ItemApi.updateItem(updateBody)
    if (res.statusCode === 204) {
      onDialogClose('dialogItem')
      await loadTable()
    }
    onDialogClose('dialogItem')
    loader.setLoadingOff()
  }
}
const changeItem = async (row) => {
  editId = row.dataset.itemId
  await openDialogWithType({
    code: row.dataset.rowItemCode,
    name: row.dataset.rowItemName,
    unit: row.dataset.rowItemUnit,
    price: row.dataset.rowItemPrice,
  })
}
const deleteItem = async (id) => {
  loader.setLoadingOn()
  const { statusCode } = await ItemApi.deleteItem(id)
  if (statusCode === 204) {
    await loadTable()
  } else {
    alert('เกิดข้อผิดพลาด')
  }
  loader.setLoadingOff()
}
const addNewItem = async () => {
  loader.setLoadingOn()
  if (
    unitValue.value == '' ||
    idValue.value == '' ||
    nameValue.value == '' ||
    priceValue.value == ''
  ) {
    alert('กรุณากรอกให้ครบทุกช่อง')
  } else {
    const itemPost = {
      itemCode: idValue.value,
      itemName: nameValue.value,
      itemPrice: priceValue.value,
      unitId: unitValue.value,
    }
    const res = await ItemApi.createItem(itemPost)
    if (res.statusCode === 201) {
      await loadTable()
    } else {
      alert('เพิ่มไม่สำเร็จ เกิดข้อผิดพลาด')
    }
    idValue.value = ''
    nameValue.value = ''
    unitValue.value = '3'
    priceValue.value = 0
    onDialogClose('dialogItem')
    loader.setLoadingOff()
  }
}
const getUnitData = async () => {
  const { statusCode, data } = await UnitApi.getUnit()
  if (statusCode === 200) {
    return data.map((e) => {
      return {
        id: e.unitId,
        value: e.unitName,
      }
    })
  }
  return []
}
const getItemData = async () => {
  const { statusCode, data } = await ItemApi.getItem()
  if (statusCode === 200) {
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
const setDropdownOption = (itemUnit, defaultValue) => {
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
async function loadTable() {
  tableBody.innerHTML = ''
  const items = await getItemData()
  for (let index = 0; index < items.length; index++) {
    const item = items[index]
    const tr = document.createElement('tr')
    const clone = templateRowTable.content.cloneNode(true)
    tr.dataset.itemId = item.itemId
    tr.dataset.rowItemCode = item.itemCode
    tr.dataset.rowItemName = item.itemName
    tr.dataset.rowItemUnit = item.unitId
    tr.dataset.rowItemPrice = item.itemPrice
    tr.appendChild(clone)
    const rowNumber = tr.querySelector('.rowNumber')
    const rowItemCode = tr.querySelector('.rowItemCode')
    const rowItemName = tr.querySelector('.rowItemName')
    const rowItemUnit = tr.querySelector('.rowItemUnit')
    const rowItemPrice = tr.querySelector('.rowItemPrice')
    const editButton = tr.querySelector('.editButton')
    const deleteButton = tr.querySelector('.deleteButton')
    editButton.addEventListener('click', () => changeItem(tr))
    deleteButton.addEventListener('click', () => deleteItem(item.itemId))
    rowNumber.textContent = index + 1
    rowItemCode.textContent = item.itemCode
    rowItemName.textContent = item.itemName
    rowItemUnit.textContent = item.unitName
    rowItemPrice.textContent = item.itemPrice
    tableBody.appendChild(tr)
  }
}
async function onPageLoad() {
  loader.setLoadingOn()
  buttonSaveChange.addEventListener('click', addNewItem)
  buttonEditChange.addEventListener('click', editItem)
  buttonCloseDialog.addEventListener('click', () => onDialogClose('dialogItem'))
  openDialogButton.addEventListener('click', () =>
    openDialogWithType(undefined),
  )
  await loadTable()
  loader.setLoadingOff()
}

onPageLoad()
