export function initModalSelectitem(elementDialog, itemList) {
  const _itemSelectContent = document.getElementById('itemSelect-content')
  const _itemSelectTitle = document.getElementById('itemSelect-title')
  const close = document.getElementById('close')
  let _resolve
  let itemIdSelect = undefined
  let _itemSelect = undefined

  const liList = []
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
  const element = elementDialog
  const posItem = element.querySelector('#posItem')
  itemList.forEach((item, id) => {
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
    liList.push(li)
  })
  const editItemPos = element.querySelector('#editItemPos')
  const addNewItemBtn = element.querySelector('#addItem')
  const closeDialogBtn = element.querySelector('#closeDialogButton')
  closeDialogBtn.addEventListener('click', () => closeModel(undefined))
  editItemPos.addEventListener('click', () => closeModel(itemIdSelect))
  addNewItemBtn.addEventListener('click', () => closeModel(itemIdSelect))
  close.addEventListener('click', () => closeModel(undefined))
  function selectedItem(li) {
    if (!!li.dataset.selected) {
      const liList = posItem.querySelectorAll('li')
      liList.forEach((e) => {
        e.classList.remove('selected')
        e.dataset.selected = false
      })
      li.classList.add('selected')
      li.dataset.selected = true
      itemIdSelect = li.dataset.itemCode
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
  function closeModel(data) {
    element.style.display = 'none'
    _resolve(data)
    itemSelect.value = undefined
  }
  return {
    openModal(itemId) {
      liList.forEach((li) => {
        li.classList.remove('selected')
      })
      if (itemId != null) {
        editItemPos.style.display = 'inline-block'
        addNewItemBtn.style.display = 'none'
        liList.forEach((li) => {
          if (li.dataset.itemCode == itemId) {
            li.classList.add('selected')
            itemIdSelect = li.dataset.itemCode
            itemSelect.value = {
              itemId: li.dataset.itemId,
              itemCode: li.dataset.itemCode,
              itemName: li.dataset.itemName,
              itemPrice: li.dataset.itemPrice,
              unitName: li.dataset.unitName,
              unitId: li.dataset.unitId,
            }
          }
        })
      } else {
        itemIdSelect = -1
        addNewItemBtn.style.display = 'inline-block'
        editItemPos.style.display = 'none'
      }

      element.style.display = 'block'
      return new Promise((resolve) => {
        _resolve = resolve
      })
    },
  }
}
