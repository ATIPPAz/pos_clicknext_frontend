import { openDialog, onDialogClose } from '../../main.js'
import { initLoader } from '../../plugins/loading.js'
import * as PosApi from '../../plugins/api/receiptApi.js'
import * as ItemApi from '../../plugins/api/itemApi.js'
import { initToast } from '../../plugins/toast.js'
const body = document.getElementById('bodyPage')
const closeDialogBtn = document.getElementById('closeDialogButton')
const close = document.getElementById('close')
const editItemPos = document.getElementById('editItemPos')
const addNewItemBtn = document.getElementById('addNewItem')
const _itemSelectContent = document.getElementById('itemSelect-content')
const _itemSelectTitle = document.getElementById('itemSelect-title')
const dateNow = document.getElementById('dateNow')
const dataTable = document.getElementById('dataTable')
const posItem = document.getElementById('posItem')
const posBody = document.getElementById('posTable')
const templateRowTable = document.getElementById('itemRow')
const savePos = document.getElementById('savePos')
const loader = initLoader(body)
const toast = initToast(body)
const receiptCode = document.getElementById('receiptCode')
let _itemSelect = undefined
const itemSelectTitle = {
  get value() {
    return _itemSelectTitle.innerHTML
  },
  set value(x) {
    if (x) {
      _itemSelectTitle.innerHTML = `<h1>Item detail</h1>`
    } else {
      _itemSelectTitle.innerHTML = `No Item Selected`
    }
  },
}
const itemSelect = {
  get value() {
    return _itemSelect
  },
  set value(x) {
    if (x) {
      itemSelectTitle.value = true
      _itemSelectContent.innerHTML = `
      <b>รหัสสินค้า</b> <br>
      ${x.itemCode}<br>
      <br>
      <b>ชื่อสินค้า</b> <br>
      ${x.itemName}<br>
      <br>
      <b>ราคา</b> <br>
      ${x.itemPrice}<br>
      <br>`
    } else {
      itemSelectTitle.value = false
      _itemSelectContent.innerHTML = ``
    }
    _itemSelect = x
  },
}
let itemSelectList = []

const _totalBeforDiscount = document.getElementById('totalBeforDiscount')
const _totalDiscount = document.getElementById('totalDiscount')
const _subTotal = document.getElementById('subTotal')
const _tradeDiscount = document.getElementById('tradeDiscount')
const _grandTotal = document.getElementById('grandTotal')
let idEdit = null
let counterIdx = 0
const total = {
  receiptTotalBeforDiscount: {
    get value() {
      return _totalBeforDiscount.value
    },
    set value(x) {
      _totalBeforDiscount.value = x
    },
  },
  receiptTotalDiscount: {
    get value() {
      return _totalDiscount.value
    },
    set value(x) {
      _totalDiscount.value = x
    },
  },
  receiptSubTotal: {
    get value() {
      return _subTotal.value
    },
    set value(x) {
      _subTotal.value = x
    },
  },
  receiptTradeDiscount: {
    get value() {
      return _tradeDiscount.value
    },
    set value(x) {
      _tradeDiscount.value = x
    },
  },
  receiptGrandTotal: {
    get value() {
      return _grandTotal.value
    },
    set value(x) {
      _grandTotal.value = x
    },
  },
  receiptDate: {
    get value() {
      return dateNow.value
    },
    set value(x) {
      dateNow.value = x
    },
  },
}
function deleteRow(rowId) {
  let idxDelete = -1
  for (let i = 0; i < posBody.childNodes.length; i++) {
    const row = posBody.childNodes[i]
    const rowNumber = row.querySelector('.rowNumber')
    if (row.dataset.counterIdx == rowId) {
      idxDelete = i + 1
    }
    if (
      row.dataset.counterIdx > rowId ||
      row.dataset.counterIdx == 'createNewRow'
    ) {
      rowNumber.textContent = rowNumber.textContent - 1
    }
  }
  itemSelectList.splice(idxDelete - 1, 1)
  console.log(itemSelectList)
  calculate()
  dataTable.deleteRow(idxDelete)
}
function assignValueToDataTable(tr, item) {
  const rowItemName = tr.querySelector('.rowItemName')
  const rowItemUnit = tr.querySelector('.rowItemUnit')
  const rowItemPrice = tr.querySelector('.rowItemPrice')
  const rowItemQty = tr.querySelector('.rowItemQty')
  const rowItemDiscountPercent = tr.querySelector('.rowItemDiscountPercent')
  const rowItemDiscount = tr.querySelector('.rowItemDiscount')
  const rowItemTotal = tr.querySelector('.rowItemTotal')
  const changeNewItemButton = tr.querySelector('.changeNewItem')
  changeNewItemButton.textContent = item.itemCode
  rowItemName.textContent = item.itemName
  rowItemUnit.textContent = item.unitName
  rowItemQty.textContent = item.qty
  rowItemPrice.textContent = item.itemPrice
  rowItemDiscountPercent.textContent = item.itemDiscountPercent
  rowItemDiscount.textContent = item.itemDiscount
  rowItemTotal.textContent = 0
  posBody.appendChild(tr)
}
async function openItemListDialog(edit = undefined) {
  loader.setLoadingOn()
  await loadItem()
  loader.setLoadingOff()
  if (edit) {
    editItemPos.style.display = 'inline-block'
    addNewItemBtn.style.display = 'none'
    const children = posItem.children
    for (let i = 0; i < children.length; i++) {
      const liData = children[i]
      if (liData.dataset.itemCode == edit) {
        liData.classList = 'selected'
        itemSelect.value = {
          itemId: liData.dataset.itemId,
          itemCode: liData.dataset.itemCode,
          itemName: liData.dataset.itemName,
          itemPrice: liData.dataset.itemPrice,
          unitName: liData.dataset.unitName,
          unitId: liData.dataset.unitId,
        }
      }
    }
  } else {
    addNewItemBtn.style.display = 'inline-block'
    editItemPos.style.display = 'none'
  }
  openDialog('dialogAddItemPos')
}
async function addNewItem() {
  if (!!itemSelect.value) {
    dataTable.deleteRow(dataTable.rows.length - 1)
    const rowItem = createTableRow(counterIdx)
    counterIdx += 1
    const rowData = {
      itemId: itemSelect.value.itemId,
      itemName: itemSelect.value.itemName,
      unitName: itemSelect.value.unitName,
      itemCode: itemSelect.value.itemCode,
      itemQty: 0,
      itemPrice: itemSelect.value.itemPrice,
      itemDiscount: 0,
      itemDiscountPercent: 0,
      unitId: itemSelect.value.unitId,
      itemAmount: 0,
      counterIdx: counterIdx - 1,
    }
    assignValueToDataTable(rowItem, rowData)
    itemSelectList.push(rowData)
    createTableRow(undefined)
    closeDialog()
    calculate()
  } else {
    toast.error('ไม่สำเร็จ', 'ไม่พบข้อมูลที่จะเพิ่ม')
  }
}
function calculate() {
  if (itemSelectList.length > 0) {
    total.receiptTotalBeforDiscount.value = itemSelectList.reduce(
      (cur, next) => cur + next.itemQty * next.itemPrice,
      0,
    )
    total.receiptTotalDiscount.value = itemSelectList.reduce(
      (cur, next) => cur + next.itemDiscount,
      0,
    )
    total.receiptSubTotal.value =
      parseFloat(total.receiptTotalBeforDiscount.value) -
      parseFloat(total.receiptTotalDiscount.value)
    total.receiptGrandTotal.value =
      parseFloat(total.receiptSubTotal.value) -
      parseFloat(total.receiptTradeDiscount.value)
  } else {
    total.receiptTotalBeforDiscount.value = 0
    total.receiptTotalDiscount.value = 0
    total.receiptSubTotal.value = 0
    total.receiptTradeDiscount.value = 0
    total.receiptGrandTotal.value = 0
  }
}
function selectedItem(li) {
  const liList = posItem.querySelectorAll('li')
  if (!!liList[li.dataset.keySelecter].dataset.selected) {
    liList.forEach((e) => (e.classList = ''))
    li.classList = 'selected'
    li.dataset.selected = true
    itemSelect.value = {
      itemId: li.dataset.itemId,
      itemCode: li.dataset.itemCode,
      itemName: li.dataset.itemName,
      itemPrice: li.dataset.itemPrice,
      unitName: li.dataset.unitName,
      unitId: li.dataset.unitId,
    }
  }
}
function closeDialog() {
  onDialogClose('dialogAddItemPos')
  itemSelect.value = undefined
}
function saveItemChange() {
  const tr = posBody.children[idEdit]
  const rowItemName = tr.querySelector('.rowItemName')
  const rowItemUnit = tr.querySelector('.rowItemUnit')
  const rowItemQty = tr.querySelector('.rowItemQty')
  const rowItemPrice = tr.querySelector('.rowItemPrice')
  const rowItemDiscountPercent = tr.querySelector('.rowItemDiscountPercent')
  const rowItemDiscount = tr.querySelector('.rowItemDiscount')
  const rowItemTotal = tr.querySelector('.rowItemTotal')
  const changeNewItemButton = tr.querySelector('.changeNewItem')
  const rowData = {
    itemId: itemSelect.value.itemId,
    itemName: itemSelect.value.itemName,
    unitName: itemSelect.value.unitName,
    itemCode: itemSelect.value.itemCode,
    itemQty: 0,
    itemPrice: itemSelect.value.itemPrice,
    itemDiscount: 0,
    itemDiscountPercent: 0,
    unitId: itemSelect.value.unitId,
    counterIdx: tr.dataset.counterIdx,
    itemAmount: 0,
  }
  rowItemName.textContent = rowData.itemName
  rowItemUnit.textContent = rowData.unitName
  rowItemQty.value = rowData.itemQty
  rowItemPrice.textContent = rowData.itemPrice
  rowItemDiscountPercent.value = rowData.itemDiscountPercent
  rowItemDiscount.textContent = rowData.itemDiscount
  rowItemTotal.textContent = rowData.itemAmount
  changeNewItemButton.textContent = rowData.itemCode
  itemSelectList[idEdit] = rowData
  closeDialog()
  calculate()
}
async function loadItem() {
  posItem.innerHTML = ''
  const { statusCode, data } = await ItemApi.getItem()
  if (statusCode == 200) {
    data.forEach((item, id) => {
      const li = document.createElement('li')
      li.dataset.keySelecter = id
      li.style.cursor = 'pointer'
      li.dataset.selected = false
      li.dataset.itemId = item.itemId
      li.dataset.itemCode = item.itemCode
      li.dataset.itemName = item.itemName
      li.dataset.itemPrice = item.itemPrice
      li.dataset.unitName = item.unitName
      li.dataset.unitId = item.unitId
      li.addEventListener('click', () => selectedItem(li))
      li.appendChild(document.createTextNode(item.itemName))
      posItem.appendChild(li)
    })
    return data
  } else {
    toast.error('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลไอเทมได้')
  }
}
function changeNewItem(id) {
  idEdit = id
  openItemListDialog(itemSelectList[id].itemCode)
}
function calRow(tr) {
  const rowItemQty = tr.querySelector('.rowItemQty')
  console.log(itemSelectList)
  console.log(tr.dataset.counterIdx)
  const rowItemPrice = tr.querySelector('.rowItemPrice')
  const rowItemDiscountPercent = tr.querySelector('.rowItemDiscountPercent')
  const rowItemDiscount = tr.querySelector('.rowItemDiscount')
  const rowItemTotal = tr.querySelector('.rowItemTotal')
  const id = itemSelectList.findIndex(
    (e) => e.counterIdx == tr.dataset.counterIdx,
  )
  itemSelectList[id].itemQty = parseFloat(rowItemQty.value)
  const price = parseFloat(rowItemPrice.textContent)
  itemSelectList[id].itemDiscountPercent = parseFloat(
    rowItemDiscountPercent.value,
  )
  const total = price * itemSelectList[id].itemQty
  itemSelectList[id].itemDiscount =
    total * (itemSelectList[id].itemDiscountPercent / 100)
  itemSelectList[id].itemAmount = total - itemSelectList[id].itemDiscount
  rowItemDiscount.textContent = itemSelectList[id].itemDiscount
  rowItemTotal.textContent = itemSelectList[id].itemAmount
  calculate()
  // const qty = rowItemQty.value

  // console.log(tr.dataset)
}
function createTableRow(id) {
  const tr = document.createElement('tr')
  const clone = templateRowTable.content.cloneNode(true)
  tr.appendChild(clone)
  const rowNumber = tr.querySelector('.rowNumber')
  const addBtn = tr.querySelector('.addNewItem')
  const changeNewItemButton = tr.querySelector('.changeNewItem')
  changeNewItemButton.addEventListener('click', () => changeNewItem(id))
  addBtn.addEventListener('click', () => openItemListDialog())
  rowNumber.textContent = dataTable.rows.length
  if (id >= 0) {
    const rowItemQty = tr.querySelector('.rowItemQty')
    const deleteButton = tr.querySelector('.deleteButton')
    const rowItemDiscountPercent = tr.querySelector('.rowItemDiscountPercent')
    rowItemDiscountPercent.disabled = false
    deleteButton.disabled = false
    rowItemQty.disabled = false
    rowItemQty.addEventListener(
      'change',
      function (e) {
        calRow(tr)
      },
      false,
    )
    rowItemDiscountPercent.addEventListener(
      'change',
      function (e) {
        calRow(tr)
      },
      false,
    )
    addBtn.style.display = 'none'
    tr.dataset.counterIdx = id
    deleteButton.addEventListener('click', () => deleteRow(id))
  } else {
    tr.dataset.counterIdx = 'createNewRow'
    changeNewItemButton.style.display = 'none'
  }
  posBody.appendChild(tr)
  return tr
}
async function createPos() {
  loader.setLoadingOn()
  if (itemSelectList.length > 0) {
    const details = itemSelectList.map((e) => {
      return {
        itemId: e.itemId,
        itemQty: e.itemQty,
        itemPrice: e.itemPrice,
        itemDiscount: e.itemDiscount,
        itemDiscountPercent: e.itemDiscountPercent,
        itemAmount: e.itemAmount,
        unitId: e.unitId,
      }
    })
    const date = total.receiptDate.value.split('/')
    const posPayload = {
      receiptCode: receiptCode.value,
      receiptDate: `${date[2]}-${date[1]}-${date[0]}`,
      receiptTotalBeforeDiscount: total.receiptTotalBeforDiscount.value,
      receiptTotalDiscount: total.receiptTotalDiscount.value,
      receiptSubTotal: total.receiptSubTotal.value,
      receiptTradeDiscount: total.receiptTradeDiscount.value,
      receiptGrandTotal: total.receiptGrandTotal.value,
      receiptdetails: details,
    }
    const { statusCode } = await PosApi.createReceipt(posPayload)
    if (statusCode == 201) {
      toast.success('สำเร็จ', 'ทำรายการสินค้าสำเร็จ')
      itemSelect.value = undefined
      itemSelectList = []
      total.receiptTotalBeforDiscount.value = 0
      total.receiptTotalDiscount.value = 0
      total.receiptSubTotal.value = 0
      total.receiptTradeDiscount.value = 0
      total.receiptGrandTotal.value = 0
      posBody.innerHTML = ''
      counterIdx = 0
      createTableRow(undefined)
      counterIdx = 0
    } else {
      toast.error('ไม่สำเร็จ', 'เกิดข้อผิดพลาด')
    }
    console.log(posPayload)
  } else {
    toast.error('ไม่สามารถบันทึกได้', 'กรุณาเลือกสินค้าก่อน')
  }
  loader.setLoadingOff()
}
function onload() {
  loader.setLoadingOn()
  editItemPos.addEventListener('click', () => saveItemChange())
  closeDialogBtn.addEventListener('click', () => closeDialog())
  close.addEventListener('click', () => closeDialog())
  savePos.addEventListener('click', () => createPos())
  addNewItemBtn.addEventListener('click', () => addNewItem())
  _tradeDiscount.addEventListener('change', (e) => {
    calculate()
  })
  createTableRow(undefined)
  counterIdx = 0
  const date = new Date()
  const dateTime = `${
    date.getDate().toString().length >= 1 ? '' : 0
  }${date.getDate()}/${(date.getMonth() + 1).toString().length > 1 ? '' : 0}${
    date.getMonth() + 1
  }/${date.getFullYear()}`
  // dateNow.value = dateTime
  total.receiptDate.value = dateTime
  loader.setLoadingOff()
}
onload()
