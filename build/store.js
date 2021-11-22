import items from "./items.json.proxy.js"
import formatCurrency from "./utils/formatCurrency.js"

const itemsContainer = document.querySelector("[data-item-container]")
const itemTemplate = document.querySelector("#item-template")
const itemTemplateClone = itemTemplate.content.cloneNode(true)
const IMAGE_SRC = "https://dummyimage.com/420x260"

export function setupStore() {
	if (!itemsContainer) return
	items.forEach((item) => {
		renderItem(item)
	})
}

function renderItem(item) {
	const itemTemplateClone = itemTemplate.content.cloneNode(true)

	const itemId = itemTemplateClone.querySelector("[data-item-id]")
	itemId.dataset.itemId = item.id

	const itemImage = itemTemplateClone.querySelector("[data-item-image]")
	itemImage.src = `${IMAGE_SRC}/${item.imageColor}/${item.imageColor}`

	const category = itemTemplateClone.querySelector("[data-category]")
	category.innerText = item.category

	const name = itemTemplateClone.querySelector("[data-name]")
	name.innerText = item.name

	const price = itemTemplateClone.querySelector("[data-price]")
	price.innerText = formatCurrency(item.priceCents / 100)

	itemsContainer.appendChild(itemTemplateClone)
}
