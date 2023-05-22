import { initToast } from '../../plugins/toast.js'
import { initLoader } from '../../plugins/loading.js'
import { statusCode as status } from '../../plugins/statusCode.js'
import * as ReceiptApi from '../../plugins/api/receiptApi.js'

const templateRowTable = document.getElementById('templateRowTable')
const templateNoData = document.getElementById('templateNoData')
const searchButton = document.getElementById('searchButton')
const dataTable = document.getElementById('receiptTable')
const _startDate = document.getElementById('startDate')
const tBody = document.getElementById('receiptTbody')
const _endDate = document.getElementById('endDate')
const body = document.getElementById('bodyPage')

const loader = initLoader(body)
const toast = initToast(body)
const date = new Date()
const dateTime = formatDateForDisplay(date)
const beforeOneDayTime = formatDateForDisplay(getPreviousDay(date))

function getPreviousDay(date = new Date()) {
  const previous = new Date(date.getTime())
  previous.setDate(date.getDate() - 1)
  return previous
}

function formatDateForDisplay(date) {
  const dayNo = (date.getDate() + '').padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${year}-${month}-${dayNo}`
}

const startDate = {
  get value() {
    return _startDate.value
  },
  set value(x) {
    _startDate.value = x
  },
}
const endDate = {
  get value() {
    return _endDate.value
  },
  set value(x) {
    _endDate.value = x
  },
}

function validateDate(start, end) {
  const date1 = new Date(start).getTime()
  const date2 = new Date(end).getTime()
  return date1 <= date2
}

async function search() {
  loader.setLoadingOn()
  if (startDate.value == '' || endDate.value == '') {
    toast.error('ข้อมูลผิดรูปแบบ', 'กรุณาเลือกวันที่ให้ครบสองอัน')
    return
  }
  if (validateDate(startDate.value, endDate.value)) {
    tBody.innerHTML = ''
    const { statusCode, data } = await ReceiptApi.getAllreceipt(
      startDate.value,
      endDate.value,
    )
    if (statusCode === status.getSuccess) {
      if (data.length > 0) {
        data.forEach((receipt) => {
          const tr = createTableRow(receipt.receiptId)
          assignValueToDataTable(tr, receipt)
        })
      } else {
        loadNodata()
      }
    } else {
      loadNodata()
    }
  } else {
    toast.error('ข้อมูลผิดรูปแบบ', 'กรุณาเลือกวันเริ่มต้นก่อนวันสิ้นสุด')
  }
  loader.setLoadingOff()
}

function assignValueToDataTable(tr, item) {
  const rowReceiptCode = tr.querySelector('.rowReceiptCode')
  const rowReceiptDate = tr.querySelector('.rowReceiptDate')
  const rowReceiptGrandPrice = tr.querySelector('.rowReceiptGrandPrice')
  rowReceiptCode.textContent = item.receiptCode
  rowReceiptDate.textContent = item.receiptDate
  rowReceiptGrandPrice.textContent = item.receiptGrandTotal
  tBody.appendChild(tr)
}
function createTableRow(id) {
  const tr = document.createElement('tr')
  const clone = templateRowTable.content.cloneNode(true)
  tr.appendChild(clone)
  tr.dataset.counterIdx = id
  const rowReceiptDetails = tr.querySelector('.rowReceiptDetails')
  rowReceiptDetails.addEventListener('click', () => detailsClick(id))
  const rowNumber = tr.querySelector('.rowNumber')
  rowNumber.textContent = dataTable.rows.length
  tBody.appendChild(tr)
  return tr
}
function detailsClick(id) {
  window.location.href = `../receiptDetail/receiptDetail.html?receiptId=${id}`
}
async function onPageLoad() {
  loader.setLoadingOn()
  startDate.value = beforeOneDayTime
  endDate.value = dateTime
  const { statusCode, data } = await ReceiptApi.getAllreceipt(
    startDate.value,
    endDate.value,
  )
  if (statusCode === status.getSuccess) {
    if (data.length > 0) {
      data.forEach((receipt) => {
        const tr = createTableRow(receipt.receiptId)
        assignValueToDataTable(tr, receipt)
      })
    } else {
      console.log('no')
      loadNodata()
    }
  } else {
    loadNodata()
  }
  searchButton.addEventListener('click', search)
  loader.setLoadingOff()
}
function loadNodata() {
  const clone = templateNoData.content.cloneNode(true)
  tBody.appendChild(clone)
}
onPageLoad()
