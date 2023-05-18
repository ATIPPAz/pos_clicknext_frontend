const dateNow = document.getElementById('dateNow')
import { initLoader } from '../../plugins/loading.js'
import { initToast } from '../../plugins/toast.js'
import { initModalSelectItem } from './modalPos.js'
import * as ItemApi from '../../plugins/api/itemApi.js'
import * as PosApi from '../../plugins/api/receiptApi.js'
const templateRowTable = document.getElementById('itemRow')
const templateRowCreate = document.getElementById('rowCreate')
const body = document.getElementById('bodyPage')
const dialog = document.getElementById('dialogAddItemPos')
const posBody = document.getElementById('posTable')
const dataTable = document.getElementById('dataTable')
const savePos = document.getElementById('savePos')
const _totalBeforDiscount = document.getElementById('totalBeforDiscount')
const _totalDiscount = document.getElementById('totalDiscount')
const _subTotal = document.getElementById('subTotal')
const _tradeDiscount = document.getElementById('tradeDiscount')
const _grandTotal = document.getElementById('grandTotal')
const toast = initToast(body)
const loader = initLoader(body)

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

let itemList = []
let modal = null
let itemSelectList = []

async function loadItem() {
  const { statusCode, data } = await ItemApi.getItem()
  if (statusCode == 200) {
    return data
  }
  toast.error('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลไอเทมได้')
  return []
}

function createRowPos() {
  const row = document.createElement('tr')
  const clone = templateRowCreate.content.cloneNode(true)
  row.appendChild(clone)
  posBody.appendChild(row)
  const addNewItemBtn = posBody.querySelector('.addNewItem')
  addNewItemBtn.addEventListener('click', async () => {
    const id = await modal.openModal()
    if (id) {
      const data = itemList.find((e) => e.itemId == +id)
      const rowData = createTableRow(data)
      itemSelectList.push(rowData)
    }
  })
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
    const id = details.findIndex((e) => e.itemQty <= 0)
    console.log(details)
    if (id == -1) {
      const date = total.receiptDate.value.split('/')
      const posPayload = {
        receiptCode: 'T',
        receiptDate: `${date[2]}-${date[1]}-${date[0]}`,
        receiptTotalBeforeDiscount: parseFloat(
          total.receiptTotalBeforDiscount.value,
        ),
        receiptTotalDiscount: parseFloat(total.receiptTotalDiscount.value),
        receiptSubTotal: parseFloat(total.receiptSubTotal.value),
        receiptTradeDiscount: parseFloat(total.receiptTradeDiscount.value),
        receiptGrandTotal: parseFloat(total.receiptGrandTotal.value),
        receiptdetails: details,
      }
      console.log(posPayload)
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
        createRowPos()
      } else {
        toast.error('ไม่สำเร็จ', 'เกิดข้อผิดพลาด')
      }
    } else {
      toast.error('ข้อมูลไม่สมบูรณ์', 'กรุณากรอกจำนวนสินค้าให้มากกว่า 0')
    }
  } else {
    toast.error('ไม่สามารถบันทึกได้', 'กรุณาเลือกสินค้าก่อน')
  }
  loader.setLoadingOff()
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
      console.log('fyudhjioklp')
      total.receiptTradeDiscount.value = 0
      total.receiptTotalBeforDiscount.value = 0
      total.receiptTotalDiscount.value = 0
      total.receiptSubTotal.value = 0
      total.receiptTradeDiscount.value = 0
      total.receiptGrandTotal.value = 0
      return
    }
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

function createTableRow(data) {
  const row = document.createElement('tr')
  const clone = templateRowTable.content.cloneNode(true)
  row.appendChild(clone)
  const tr = dataTable.insertRow(dataTable.rows.length - 1)
  tr.innerHTML = row.innerHTML
  const rowNumber = tr.querySelector('.rowNumber')
  const rowItemName = tr.querySelector('.rowItemName')
  const rowItemUnit = tr.querySelector('.rowItemUnit')
  const rowItemPrice = tr.querySelector('.rowItemPrice')
  const rowItemQty = tr.querySelector('.rowItemQty')
  const rowItemDiscountPercent = tr.querySelector('.rowItemDiscountPercent')
  const rowItemDiscount = tr.querySelector('.rowItemDiscount')
  const rowItemTotal = tr.querySelector('.rowItemTotal')
  const changeNewItem = tr.querySelector('.changeNewItem')
  const deleteButton = tr.querySelector('.deleteButton')

  rowItemQty.addEventListener(
    'change',
    function (e) {
      if (!isValidValue(parseFloat(e.target.value))) {
        toast.error('ข้อมูลไม่ถูกต้อง', 'ค่าที่ใส่มาห้ามน้อยกว่า0')
        e.target.value = 0
        rowData.itemDiscountPercent = 0
      }
      calRow()
      calculate()
    },
    false,
  )
  rowItemDiscountPercent.addEventListener(
    'change',
    function (e) {
      if (!isValidValue(parseFloat(e.target.value))) {
        toast.error('ข้อมูลไม่ถูกต้อง', 'ค่าที่ใส่มาห้ามน้อยกว่า0')
        e.target.value = 0
        rowData.itemDiscountPercent = 0
      } else if (parseFloat(e.target.value) > 100) {
        toast.error('ข้อมูลไม่ถูกต้อง', 'ห้ามใส่เกิน 100%')
        e.target.value = 0
        rowData.itemDiscountPercent = 0
      }
      calRow()
      calculate()
    },
    false,
  )
  changeNewItem.addEventListener('click', async () => {
    const idEdit = itemSelectList.findIndex((e) => e.index == tr.dataset.index)
    const idBeforeChange = itemSelectList[idEdit].itemId
    const idAfterChange = await modal.openModal(idBeforeChange)
    if (idBeforeChange != idAfterChange && idAfterChange) {
      const data = itemList.find((e) => e.itemId == idAfterChange)
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
        index: tr.dataset.index,
        itemAmount: 0,
      }

      rowItemName.textContent = rowData.itemName
      rowItemUnit.textContent = rowData.unitName
      rowItemQty.value = rowData.itemQty
      rowItemPrice.textContent = rowData.itemPrice
      rowItemDiscountPercent.value = rowData.itemDiscountPercent
      rowItemDiscount.textContent = rowData.itemDiscount
      rowItemTotal.textContent = rowData.itemAmount
      changeNewItem.textContent = rowData.itemCode
      itemSelectList[idEdit] = rowData
      calculate()
    }
  })
  deleteButton.addEventListener('click', () => {
    let index = itemSelectList.findIndex((e) => e.index === tr.dataset.index)
    itemSelectList.splice(index, 1)
    posBody.removeChild(tr)
    for (let i = index; i < posBody.childNodes.length; i++) {
      index = i
      const row = posBody.childNodes[i]
      const rowNumber = row.querySelector('.rowNumber')
      if (row.dataset.index > tr.dataset.index) {
        rowNumber.textContent = i + 1
      }
    }
    posBody.childNodes[posBody.childNodes.length - 1].querySelector(
      '.rowNumber',
    ).textContent = index + 1
    calculate()
  })
  tr.dataset.index = posBody.children.length - 1
  changeNewItem.textContent = data.itemCode
  rowNumber.textContent = posBody.children.length - 1
  rowItemName.textContent = data.itemName
  rowItemUnit.textContent = data.unitName
  rowItemQty.textContent = data.qty
  rowItemPrice.textContent = data.itemPrice
  rowItemDiscountPercent.textContent = data.itemDiscountPercent
  rowItemDiscount.textContent = 0
  rowItemTotal.textContent = 0
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
    index: tr.dataset.index,
  }
  const createRow = posBody.children[posBody.children.length - 1]
  const createRowNumber = createRow.querySelector('.rowNumber')
  createRowNumber.textContent = posBody.children.length
  return rowData
  function isValidValue(value) {
    if (value < 0 || isNaN(value)) {
      return false
    }
    return true
  }
  function calRow() {
    const index = itemSelectList.findIndex((e) => e.index == rowData.index)
    itemSelectList[index].itemQty = parseFloat(rowItemQty.value)
    const price = parseFloat(rowItemPrice.textContent)
    const total = price * itemSelectList[index].itemQty
    itemSelectList[index].itemDiscountPercent = parseFloat(
      rowItemDiscountPercent.value,
    )
    itemSelectList[index].itemDiscount =
      total * (itemSelectList[index].itemDiscountPercent / 100)
    itemSelectList[index].itemAmount =
      total - itemSelectList[index].itemDiscount
    rowItemDiscount.textContent = itemSelectList[index].itemDiscount
    rowItemTotal.textContent = itemSelectList[index].itemAmount
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  loader.setLoadingOn()
  createRowPos()
  itemList = await loadItem()
  savePos.addEventListener('click', () => createPos())
  modal = initModalSelectItem(dialog, itemList)

  _tradeDiscount.addEventListener('change', (e) => {
    calculate()
  })
  const date = new Date()
  const dateTime = `${
    date.getDate().toString().length >= 1 ? '' : 0
  }${date.getDate()}/${(date.getMonth() + 1).toString().length > 1 ? '' : 0}${
    date.getMonth() + 1
  }/${date.getFullYear()}`
  total.receiptDate.value = dateTime
  loader.setLoadingOff()
})
