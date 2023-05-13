import { addDataInTable, openDialog } from '../../main.js'
const dateNow = document.getElementById('dateNow')
const dataTable = document.getElementById('dataTable')
const posBody = document.getElementById('posTable')
const templateRowTable = document.getElementById('itemRow')
let listItems = []
let counterIdx = 0
let newItem = {}
let TotalBeforeDiscount = 0
let TotalDiscount = 0
let SubTotal = 0
let TradeDiscount = 0
let GrandTotal = 0
// let Date = 0
const total = {
  receiptTotalBeforeDiscount: {
    get value() {
      return TotalBeforeDiscount
    },
    set value(x) {
      TotalBeforeDiscount = x
    },
  },
  receiptTotalDiscount: {
    get value() {
      return TotalDiscount
    },
    set value(x) {
      TotalDiscount = x
    },
  },
  receiptSubTotal: {
    get value() {
      return SubTotal
    },
    set value(x) {
      SubTotal = x
    },
  },
  receiptTradeDiscount: {
    get value() {
      return TotalDiscount
    },
    set value(x) {
      TotalDiscount = x
    },
  },
  receiptGrandTotal: {
    get value() {
      return TotalDiscount
    },
    set value(x) {
      TotalDiscount = x
    },
  },
  receiptDate: {
    get value() {
      return TotalDiscount
    },
    set value(x) {
      TotalDiscount = x
    },
  },
}
const deleteRow = (rowId) => {
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
  // dont forget to delete item in list (item before send to backend)
  dataTable.deleteRow(idxDelete)
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
  console.log(rowItemDiscount)
  rowItemDiscount.textContent = item.itemDiscount
  rowItemTotal.textContent = item.itemId
  posBody.appendChild(tr)
}
const addNewItem = () => {
  counterIdx += 1
  dataTable.deleteRow(dataTable.rows.length - 1)
  const rowItem = createTableRow(counterIdx)
  assignValueToDataTable(rowItem, {
    itemId: newItem.itemId,
    itemName: newItem.itemName,
    unitName: newItem.unitName,
    Qty: newItem.Qty,
    itemPrice: newItem.itemPrice,
    itemDiscount: newItem.itemDiscount,
    itemDiscountPercent: newItem.itemDiscountPercent,
    unitId: newItem.unitId,
  })
  createTableRow('createNewRow', true)
}
const changeNewItem = () => {
  console.log('testse')
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
    // const rowItemDiscount = tr.querySelector('.rowItemDiscount')
    // rowItemDiscount.disabled = false
    rowItemDiscountPercent.disabled = false
    deleteButton.disabled = false
    deleteButton.addEventListener('click', () => deleteRow(id))
    rowItemQty.disabled = false
    addBtn.style.display = 'none'
    return tr
  }
  changeNewItemButton.style.display = 'none'
  posBody.appendChild(tr)
  return tr
}

const posFuction = {
  openItemPosDialog() {
    total.receiptTotalBeforeDiscount = 1

    openDialog('dialogAddItemPos')
  },
  addItem() {
    deleteSelectRow()
    createSelectRow()
  },
  deleteSelectRow() {
    posBody.deleteRow(posBody.rows.length - 1)
  },
  createSelectRow() {
    const idRow = posBody.rows.length
    const newRow = {
      idRow: idRow,
      idItem: `
      <button onclick="openItemPosDialog()" >
          เลือกสินค้า
      </button>
    `,
      name: '',
      unit: '',
      qty: `
      <input type="number" onclick="changeItem('${idRow}')" disabled value="0">

      </input>
    `,
      price: 0,
      discountPercent: `
      <input type="number" onclick="changeItem('${idRow}')" disabled  value="0">

      </input>
    `,
      discount: `
      <input type="number" onclick="changeItem('${idRow}')" disabled value="0">

      </input>
    `,
      total: 0,
    }
    const table = addDataInTable('posTable', [newRow])

    table.row[0].cells[9].innerHTML = `
        <div><button onclick="deleteItem('${idRow}')" disabled>
            ลบ
        </button></div>`
  },
}
function onload() {
  createTableRow('createNewRow', true)

  for (let index = 0; index < 10; index++) {
    const item = {
      itemId: dataTable.rows.length * 3 + 5 * 4,
      itemName: 'fjdkpl',
      unitName: 'fkld',
      Qty: 12,
      itemPrice: 12,
      itemDiscount: 12,
      itemDiscountPercent: 23,
      unitId: 3,
    }
    newItem = item
    addNewItem()
  }
  // posFuction.createSelectRow()
  const date = new Date()
  const dateTime = `${
    date.getDate().toString().length >= 1 ? '' : 0
  }${date.getDate()}/${(date.getMonth() + 1).toString().length > 1 ? '' : 0}${
    date.getMonth() + 1
  }/${date.getFullYear()}`
  dateNow.value = dateTime
}
onload()
for (const key in posFuction) {
  window[key] = posFuction[key]
}
