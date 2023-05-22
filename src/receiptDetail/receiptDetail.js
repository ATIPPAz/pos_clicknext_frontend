import { initLoader } from '../../plugins/loading.js'
import { initToast } from '../../plugins/toast.js'
import { statusCode as status } from '../../plugins/statusCode.js'
import * as ReceiptApi from '../../plugins/api/receiptApi.js'

const _receiptTotalDiscount = document.getElementById('receiptTotalDiscount')
const _receiptTradeDiscount = document.getElementById('receiptTradeDiscount')
const _receiptGrandTotal = document.getElementById('receiptGrandTotal')
const templateRowTable = document.getElementById('templateRowTable')
const _receiptSubTotal = document.getElementById('receiptSubTotal')
const _receiptDate = document.getElementById('receiptDate')
const _receiptId = document.getElementById('receiptId')
const tableBody = document.getElementById('tableBody')
const titleTag = document.getElementById('titleTag')
const _receiptTotalBeforeDiscount = document.getElementById(
  'receiptTotalBeforeDiscount',
)
const body = document.getElementById('bodyPage')

const loader = initLoader(body)
const Toast = initToast(body)

const receiptTotalBeforeDiscount = {
  get value() {
    return _receiptTotalBeforeDiscount.value
  },
  set value(x) {
    _receiptTotalBeforeDiscount.value = x
  },
}
const receiptTotalDiscount = {
  get value() {
    return _receiptTotalDiscount.value
  },
  set value(x) {
    _receiptTotalDiscount.value = x
  },
}
const receiptSubTotal = {
  get value() {
    return _receiptSubTotal.value
  },
  set value(x) {
    _receiptSubTotal.value = x
  },
}
const receiptTradeDiscount = {
  get value() {
    return _receiptTradeDiscount.value
  },
  set value(x) {
    _receiptTradeDiscount.value = x
  },
}
const receiptGrandTotal = {
  get value() {
    return _receiptGrandTotal.value
  },
  set value(x) {
    _receiptGrandTotal.value = x
  },
}
const receiptDate = {
  get value() {
    return _receiptDate.value
  },
  set value(x) {
    return (_receiptDate.value = x)
  },
}
const receiptCode = {
  get value() {
    return _receiptId.value
  },
  set value(x) {
    return (_receiptId.value = x)
  },
}

function formatDateForDisplay(date) {
  const dayNo = (date.getDate() + '').padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${year}-${month}-${dayNo}`
}

async function getDetailsData() {
  const receiptId = new URLSearchParams(window.location.search).get('receiptId')
  const { statusCode, data } = await ReceiptApi.getOneReceipt(receiptId)
  if (statusCode === status.getSuccess) {
    return data
  }
  return []
}

function createRow(index, item) {
  const tr = document.createElement('tr')
  const clone = templateRowTable.content.cloneNode(true)
  tr.appendChild(clone)
  const rowNumber = tr.querySelector('.rowNumber')
  rowNumber.textContent = index + 1
  const rowItemCode = tr.querySelector('.rowItemCode')
  const rowItemName = tr.querySelector('.rowItemName')
  const rowItemUnit = tr.querySelector('.rowItemUnit')
  const rowItemQty = tr.querySelector('.rowItemQty')
  const rowItemPrice = tr.querySelector('.rowItemPrice')
  const rowItemDiscountPercent = tr.querySelector('.rowItemDiscountPercent')
  const rowItemDiscount = tr.querySelector('.rowItemDiscount')
  const rowItemTotal = tr.querySelector('.rowItemTotal')
  rowItemCode.textContent = item.itemCode
  rowItemName.textContent = item.itemName
  rowItemUnit.textContent = item.unitName
  rowItemQty.textContent = item.itemQty
  rowItemPrice.textContent = item.itemPrice.toFixed(2)
  rowItemDiscountPercent.textContent = item.itemDiscountPercent.toFixed(2)
  rowItemDiscount.textContent = item.itemDiscount.toFixed(2)
  rowItemTotal.textContent = item.itemAmount.toFixed(2)
  return tr
}

async function loadTable() {
  loader.setLoadingOn()
  tableBody.innerHTML = ''
  const res = await getDetailsData()
  if (res.receiptdetails.length !== 0) {
    res.receiptdetails.forEach((item, index) => {
      const row = createRow(index, item)
      tableBody.appendChild(row)
    })
    receiptCode.value = res.receiptCode
    titleTag.textContent = `Receipt: ${res.receiptCode} Detail`
    const date = new Date(res.receiptDate)
    receiptDate.value = formatDateForDisplay(date)
    receiptTotalBeforeDiscount.value = res.receiptTotalBeforeDiscount.toFixed(2)
    receiptTotalDiscount.value = res.receiptTotalDiscount.toFixed(2)
    receiptSubTotal.value = res.receiptSubTotal.toFixed(2)
    receiptTradeDiscount.value = res.receiptTradeDiscount.toFixed(2)
    receiptGrandTotal.value = res.receiptGrandTotal.toFixed(2)
  } else {
    Toast.error('ไม่สำร็จ', 'มีข้อผิดพลาด')
  }
  loader.setLoadingOff()
}

loadTable()
