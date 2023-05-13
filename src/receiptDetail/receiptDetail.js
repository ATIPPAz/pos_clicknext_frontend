import * as ReceiptApi from '../../plugins/api/receiptApi.js'
const initPage = () => {
  const receiptId = new URLSearchParams(window.location.search).get('receiptId')
  console.log(receiptId)
  const res = ReceiptApi.getOneReceipt(receiptId)
  console.log(res)
}
const assignValueToDataTable = (tr, item) => {
  const rowItemName = tr.querySelector('.rowItemName')
  const rowItemUnit = tr.querySelector('.rowItemUnit')
  const rowItemPrice = tr.querySelector('.rowItemPrice')
  const rowItemQty = tr.querySelector('.rowItemQty')
  const rowItemDiscountPercent = tr.querySelector('.rowItemDiscountPercent')
  const rowItemDiscount = tr.querySelector('.rowItemDiscount')
  const rowItemTotal = tr.querySelector('.rowItemTotal')
  const changeNewItemButton = tr.querySelector('.changeNewItem')
  changeNewItemButton.textContent = item.itemId
  rowItemName.textContent = item.itemName
  rowItemUnit.textContent = item.unitName
  rowItemQty.textContent = item.Qty
  rowItemPrice.textContent = item.itemPrice
  rowItemDiscountPercent.textContent = item.itemDiscountPercent
  rowItemDiscount.textContent = item.itemDiscount
  rowItemTotal.textContent = item.itemId
  posBody.appendChild(tr)
}
const createTableRow = (id, isCreate = false) => {
  const tr = document.createElement('tr')
  const clone = templateRowTable.content.cloneNode(true)
  tr.dataset.counterIdx = id
  tr.appendChild(clone)
  const rowNumber = tr.querySelector('.rowNumber')
  const addBtn = tr.querySelector('.addNewItem')
  const changeNewItemButton = tr.querySelector('.changeNewItem')
  changeNewItemButton.addEventListener('click', () => changeNewItem())
  addBtn.addEventListener('click', addNewItem)
  rowNumber.textContent = dataTable.rows.length
  if (!isCreate) {
    const rowItemQty = tr.querySelector('.rowItemQty')
    const deleteButton = tr.querySelector('.deleteButton')
    const rowItemDiscountPercent = tr.querySelector('.rowItemDiscountPercent')
    const rowItemDiscount = tr.querySelector('.rowItemDiscount')
    rowItemDiscount.disabled = false
    rowItemDiscountPercent.disabled = false
    deleteButton.disabled = false
    deleteButton.addEventListener('click', () => deleteRow(id))
    deleteButton.textContent = id
    rowItemQty.disabled = false
    addBtn.style.display = 'none'
    return tr
  }
  changeNewItemButton.style.display = 'none'
  posBody.appendChild(tr)
  return tr
}
initPage()
