import * as ReceiptApi from '../../plugins/api/receiptApi.js'
const _receiptId = document.getElementById("receiptId");
import { initLoader } from "../../plugins/loading.js";
const body = document.getElementById("bodyPage");
const loader = initLoader(body);
const _receiptDate = document.getElementById("receiptDate");
const tableBody = document.getElementById("tableBody");
const _receiptTotalBeforeDiscount = document.getElementById(
  "receiptTotalBeforeDiscount"
);
import { initToast } from "../../plugins/toast.js";
const Toast = initToast(body);
const _receiptTotalDiscount = document.getElementById("receiptTotalDiscount");
const _receiptSubTotal = document.getElementById("receiptSubTotal");
const _receiptTradeDiscount = document.getElementById("receiptTradeDiscount");
const _receiptGrandTotal = document.getElementById("receiptGrandTotal");
const templateRowTable = document.getElementById("templateRowTable");
const receiptTotalBeforeDiscount = {
  get value() {
    return _receiptTotalBeforeDiscount.value;
  },
  set value(x) {
    _receiptTotalBeforeDiscount.value = x;
  },
};
const receiptTotalDiscount = {
  get value() {
    return _receiptTotalDiscount.value;
  },
  set value(x) {
    _receiptTotalDiscount.value = x;
  },
};
const receiptSubTotal = {
  get value() {
    return _receiptSubTotal.value;
  },
  set value(x) {
    _receiptSubTotal.value = x;
  },
};
const receiptTradeDiscount = {
  get value() {
    return _receiptTradeDiscount.value;
  },
  set value(x) {
    _receiptTradeDiscount.value = x;
  },
};
const receiptGrandTotal = {
  get value() {
    return _receiptGrandTotal.value;
  },
  set value(x) {
    _receiptGrandTotal.value = x;
  },
};
const receiptDate = {
  get value() {
    return _receiptDate.value;
  },
  set value(x) {
    return (_receiptDate.value = x);
  },
};
const receiptCode = {
  get value() {
    return _receiptId.value;
  },
  set value(x) {
    return (_receiptId.value = x);
  },
};
const initPage = async () => {
  loader.setLoadingOn();
  const receiptId = new URLSearchParams(window.location.search).get(
    "receiptId"
  );
  const { statusCode, data } = await ReceiptApi.getOneReceipt(receiptId);
  if (statusCode == 200) {
    receiptCode.value = data.receiptCode;
    const date = data.receiptDate.split("T")[0];
    receiptDate.value = date;
    receiptTotalBeforeDiscount.value = data.receiptTotalBeforeDiscount;
    receiptTotalDiscount.value = data.receiptTotalDiscount;
    receiptSubTotal.value = data.receiptSubTotal;
    receiptTradeDiscount.value = data.receiptTradeDiscount;
    receiptGrandTotal.value = data.receiptGrandTotal;
    data.receiptdetails.forEach((detail, index) => {
      const row = createTableRow(index + 1);
      assignValueToDataTable(row, detail);
    });
  } else {
    Toast.error("ไม่สำร็จ", "มีข้อผิดพลาด");
  }
  loader.setLoadingOff();
};
const assignValueToDataTable = (tr, item) => {
  const rowItemCode = tr.querySelector(".rowItemCode");
  const rowItemName = tr.querySelector(".rowItemName");
  const rowItemUnit = tr.querySelector(".rowItemUnit");
  const rowItemQty = tr.querySelector(".rowItemQty");
  const rowItemPrice = tr.querySelector(".rowItemPrice");
  const rowItemDiscountPercent = tr.querySelector(".rowItemDiscountPercent");
  const rowItemDiscount = tr.querySelector(".rowItemDiscount");
  const rowItemTotal = tr.querySelector(".rowItemTotal");
  tr.dataset.rowItemCode = item.itemCode;
  tr.dataset.rowItemName = item.itemName;
  tr.dataset.rowItemUnit = item.unitName;
  tr.dataset.rowItemQty = item.itemQty;
  tr.dataset.rowItemPrice = item.itemPrice;
  tr.dataset.rowItemDiscountPercent = item.itemDiscountPercent;
  tr.dataset.rowItemDiscount = item.itemDiscount;
  tr.dataset.rowItemTotal = item.itemAmount;
  rowItemCode.textContent = item.itemCode;
  rowItemName.textContent = item.itemName;
  rowItemUnit.textContent = item.unitName;
  rowItemQty.textContent = item.itemQty;
  rowItemPrice.textContent = item.itemPrice;
  rowItemDiscountPercent.textContent = item.itemDiscountPercent;
  rowItemDiscount.textContent = item.itemDiscount;
  rowItemTotal.textContent = item.itemAmount;
};
const createTableRow = (id) => {
  const tr = document.createElement("tr");
  const clone = templateRowTable.content.cloneNode(true);
  tr.dataset.counterIdx = id;
  tr.appendChild(clone);
  const rowNumber = tr.querySelector(".rowNumber");
  rowNumber.textContent = id;
  tableBody.appendChild(tr);
  return tr;
};
initPage()
