export function initModalSelectItem(elementDialog, itemList) {
  const _itemSelectContent = elementDialog.querySelector('.itemSelect-content')
  const _itemSelectTitle = elementDialog.querySelector('.itemSelect-title')
  const close = elementDialog.querySelector('.close')
  let _resolve

  let selectedItemIndex = undefined

  const liList = []

  const itemSelect = {
    get value() {
      return itemList[selectedItemIndex]
    },
    set value(x) {
      const find = itemList.findIndex((e) => e.itemId == x)
      selectedItemIndex = find >= 0 ? find : undefined
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
  const posItem = element.querySelector('.itemList')
  itemList.forEach((item, index) => {
    const li = document.createElement('li')
    li.dataset.index = index
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
  const selectItem = element.querySelector('.selectItem')
  const closeDialogBtn = element.querySelector('.closeDialogButton')
  closeDialogBtn.addEventListener('click', () => {
    selectedItemIndex = undefined
    closeModel()
  })
  selectItem.addEventListener('click', () => closeModel())
  close.addEventListener('click', () => {
    selectedItemIndex = undefined
    closeModel()
  })
  function setCurrentItem() {
    console.log(itemSelect.value)
    if (!!itemSelect.value) {
      itemSelectTitle.value = true
      _itemSelectContent.innerHTML = `
          <b>รหัสสินค้า</b> <br>
          ${itemSelect.value.itemCode}<br>
          <br>
          <b>ชื่อสินค้า</b> <br>
          ${itemSelect.value.itemName}<br>
          <br>
          <b>ราคา</b> <br>
          ${itemSelect.value.itemPrice}<br>
          <br>`
    } else {
      itemSelectTitle.value = false
      _itemSelectContent.innerHTML = ``
    }
  }
  function selectedItem(li) {
    if (!!li.dataset.selected) {
      const liList = posItem.querySelectorAll('li')
      liList.forEach((e) => {
        e.classList.remove('selected')
        e.dataset.selected = false
      })
      console.log(li.dataset)
      li.classList.add('selected')
      li.dataset.selected = true
      selectedItemIndex = +li.dataset.index
      setCurrentItem()
    }
  }
  function closeModel() {
    element.style.display = 'none'
    _resolve(itemSelect.value?.itemId)
    selectedItemIndex = undefined
  }
  return {
    openModal(itemId = null) {
      liList.forEach((li) => {
        li.classList.remove('selected')
      })
      if (itemId != null) {
        const index = liList.findIndex((e) => e.dataset.itemId == itemId)
        if (index >= 0) {
          const li = liList[index]
          console.log(li)
          li.classList.add('selected')
          selectedItemIndex = index
        }
      } else {
        selectedItemIndex = undefined
      }
      setCurrentItem()
      console.log(selectedItemIndex)

      element.style.display = 'block'

      return new Promise((resolve) => {
        _resolve = resolve
      })
    },
  }
}
