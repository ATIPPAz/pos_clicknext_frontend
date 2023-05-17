import { initLoader } from '../../plugins/loading.js'
const body = document.getElementById('bodyPage')
const loader = initLoader(body)
import * as PosApi from '../../plugins/api/receiptApi.js'
import * as ItemApi from '../../plugins/api/itemApi.js'
import { initToast } from '../../plugins/toast.js'
import { initModalSelectitem } from './modalPos.js'
const dialog = document.getElementById('dialogAddItemPos')
const dateNow = document.getElementById('dateNow')
const dataTable = document.getElementById('dataTable')
const posItem = document.getElementById('posItem')
const posBody = document.getElementById('posTable')
const templateRowTable = document.getElementById('itemRow')
const savePos = document.getElementById('savePos')
const toast = initToast(body)
let modal = null
const receiptCode = document.getElementById('receiptCode')
let itemSelectList = []
const _totalBeforDiscount = document.getElementById('totalBeforDiscount')
const _totalDiscount = document.getElementById('totalDiscount')
const _subTotal = document.getElementById('subTotal')
const _tradeDiscount = document.getElementById('tradeDiscount')
const _grandTotal = document.getElementById('grandTotal')
let counterIdx = 0
let itemList = []
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
  changeNewItemButton.addEventListener('click', () =>
    changeItemInReceipt(tr, item.itemCode),
  )
  rowItemName.textContent = item.itemName
  rowItemUnit.textContent = item.unitName
  rowItemQty.textContent = item.qty
  rowItemPrice.textContent = item.itemPrice
  rowItemDiscountPercent.textContent = item.itemDiscountPercent
  rowItemDiscount.textContent = item.itemDiscount
  rowItemTotal.textContent = 0
  posBody.appendChild(tr)
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
    if (total.receiptTotalBeforDiscount.value <= 0) {
      total.receiptTradeDiscount.value = 0
      return
    }
    if (isNaN(parseFloat(total.receiptTradeDiscount.value))) {
      toast.error('เกิดข้อผิดพลาด', 'ข้อมูลที่กรอกไม่ถูกต้อง')
      total.receiptTradeDiscount.value = 0
      return
    }
    total.receiptSubTotal.value =
      parseFloat(total.receiptTotalBeforDiscount.value) -
      parseFloat(total.receiptTotalDiscount.value)
    total.receiptGrandTotal.value =
      parseFloat(total.receiptSubTotal.value) -
      parseFloat(total.receiptTradeDiscount.value)
  } else {
    toast.error('ไม่พบข้อมูลสินค้า', 'กรุณาเลือกข้อมูลสินค้าก่อน')

    total.receiptTotalBeforDiscount.value = 0
    total.receiptTotalDiscount.value = 0
    total.receiptSubTotal.value = 0
    total.receiptTradeDiscount.value = 0
    total.receiptGrandTotal.value = 0
  }
}
async function loadItem() {
  posItem.innerHTML = ''
  const { statusCode, data } = await ItemApi.getItem()
  if (statusCode == 200) {
    // data.forEach((item, id) => {
    //   const li = document.createElement('li')
    //   li.dataset.keySelecter = id
    //   li.style.cursor = 'pointer'
    //   li.dataset.selected = false
    //   li.dataset.itemId = item.itemId
    //   li.dataset.itemCode = item.itemCode
    //   li.dataset.itemName = item.itemName
    //   li.dataset.itemPrice = item.itemPrice
    //   li.dataset.unitName = item.unitName
    //   li.dataset.unitId = item.unitId
    //   li.addEventListener('click', () => selectedItem(li))
    //   li.appendChild(document.createTextNode(item.itemName))
    //   posItem.appendChild(li)
    // })
    return data
  } else {
    toast.error('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลไอเทมได้')
    return []
  }
}
function calRow(tr) {
  const rowItemQty = tr.querySelector('.rowItemQty')
  const rowItemPrice = tr.querySelector('.rowItemPrice')
  const rowItemDiscountPercent = tr.querySelector('.rowItemDiscountPercent')
  const rowItemDiscount = tr.querySelector('.rowItemDiscount')
  const rowItemTotal = tr.querySelector('.rowItemTotal')
  const id = itemSelectList.findIndex(
    (e) => e.counterIdx == tr.dataset.counterIdx,
  )
  itemSelectList[id].itemQty = parseFloat(rowItemQty.value)
  console.log(rowItemQty.value)
  console.log(itemSelectList[id].itemQty)
  if (itemSelectList[id].itemQty < 0 || isNaN(itemSelectList[id].itemQty)) {
    toast.error('ข้อมูลไม่ถูกต้อง', 'ค่าที่ใส่มาห้ามน้อยกว่า0')
    rowItemQty.value = 0
    itemSelectList[id].itemQty = 0
    return
  }

  const price = parseFloat(rowItemPrice.textContent)
  const total = price * itemSelectList[id].itemQty
  itemSelectList[id].itemDiscountPercent = parseFloat(
    rowItemDiscountPercent.value,
  )
  if (
    itemSelectList[id].itemDiscountPercent < 0 ||
    isNaN(itemSelectList[id].itemDiscountPercent)
  ) {
    toast.error('ข้อมูลไม่ถูกต้อง', 'ค่าที่ใส่มาห้ามน้อยกว่า0')
    rowItemDiscountPercent.value = 0
    itemSelectList[id].itemDiscountPercent = 0
    return
  }
  itemSelectList[id].itemDiscount =
    total * (itemSelectList[id].itemDiscountPercent / 100)

  itemSelectList[id].itemAmount = total - itemSelectList[id].itemDiscount
  rowItemDiscount.textContent = itemSelectList[id].itemDiscount
  rowItemTotal.textContent = itemSelectList[id].itemAmount
  calculate()
}
function createTableRow(id) {
  const tr = document.createElement('tr')
  const clone = templateRowTable.content.cloneNode(true)
  tr.appendChild(clone)
  const rowNumber = tr.querySelector('.rowNumber')
  const addBtn = tr.querySelector('.addNewItem')
  const changeNewItemButton = tr.querySelector('.changeNewItem')
  changeNewItemButton.addEventListener('click', () => {
    changeItemInReceipt({ row: tr, id: id })
  })
  addBtn.addEventListener('click', () => addItemToReceipt())
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
    const deleteButton = tr.querySelector('.deleteButton')
    deleteButton.classList.remove('red')
    deleteButton.style.cursor = 'not-allowed'
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
  } else {
    toast.error('ไม่สามารถบันทึกได้', 'กรุณาเลือกสินค้าก่อน')
  }
  loader.setLoadingOff()
}
async function addItemToReceipt() {
  const id = await modal.openModal()
  if (id) {
    if (id != -1) {
      const data = itemList.find((e) => e.itemCode == id)
      dataTable.deleteRow(dataTable.rows.length - 1)
      const rowItem = createTableRow(counterIdx)
      counterIdx += 1
      const rowData = {
        itemId: data.itemId,
        itemName: data.itemName,
        unitName: data.unitName,
        itemCode: data.itemCode,
        itemQty: 0,
        itemPrice: data.itemPrice,
        itemDiscount: 0,
        itemDiscountPercent: 0,
        unitId: data.unitId,
        itemAmount: 0,
        counterIdx: counterIdx - 1,
      }
      assignValueToDataTable(rowItem, rowData)
      itemSelectList.push(rowData)
      createTableRow(undefined)
      calculate()
    } else {
      toast.error('ไม่สำเร็จ', 'ไม่พบข้อมูลที่จะเพิ่ม')
    }
  }
}
async function changeItemInReceipt(tr, id) {
  const idBeforeChange = id
  const idAfterChange = await modal.openModal(idBeforeChange)
  if (idBeforeChange != idAfterChange) {
    const rowItemName = tr.querySelector('.rowItemName')
    const rowItemUnit = tr.querySelector('.rowItemUnit')
    const rowItemQty = tr.querySelector('.rowItemQty')
    const rowItemPrice = tr.querySelector('.rowItemPrice')
    const rowItemDiscountPercent = tr.querySelector('.rowItemDiscountPercent')
    const rowItemDiscount = tr.querySelector('.rowItemDiscount')
    const rowItemTotal = tr.querySelector('.rowItemTotal')
    const changeNewItemButton = tr.querySelector('.changeNewItem')
    const data = itemList.find((e) => e.itemCode == idAfterChange)
    const rowData = {
      itemId: data.itemId,
      itemName: data.itemName,
      unitName: data.unitName,
      itemCode: data.itemCode,
      itemQty: 0,
      itemPrice: data.itemPrice,
      itemDiscount: 0,
      itemDiscountPercent: 0,
      unitId: data.unitId,
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
    const idEdit = itemSelectList.findIndex(
      (e) => e.counterIdx == tr.dataset.counterIdx,
    )
    itemSelectList[idEdit] = rowData
    calculate()
  }
}
async function onload() {
  loader.setLoadingOn()
  itemList = await loadItem()
  modal = initModalSelectitem(dialog, itemList)

  savePos.addEventListener('click', () => createPos())
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
