import formatCurrency from "./utils/formatCurrency.js"
import items from "./items.json.proxy.js"

const cartButton = document.querySelector("[data-cart-btn]")
const cart = document.querySelector("[data-cart]")
const cartItemTemplate = document.querySelector("#cart-item-template")
const cartItemsContainer = document.querySelector("[data-cart-items-container]")
const KEY_PREFIX = "SHOPPING_CART_PRACTICE_JS"
const key = `${KEY_PREFIX}-list`
const IMAGE_SRC = "https://dummyimage.com/210x130"
const cartTotalPrice = document.querySelector("[data-cart-total]")
const redDot = document.querySelector("[data-red-dot]")
let shoppingCartList = loadCart() || []

export function setupShoppingCart() {
	cartButton.addEventListener("click", () => {
		cart.classList.toggle("invisible")
	})

	items.forEach((item) => {
		item.quantity = 1
	})

	if (shoppingCartList.length !== 0) {
		renderCart(shoppingCartList)
		showCart()
	}
	document.addEventListener("click", (e) => {
		if (e.target.matches("[data-add-to-cart-btn]")) {
			const element = e.target.closest("[data-item-id]")
			const item = items.find((item) => item.id === parseInt(element.dataset.itemId))
			const sameItem = shoppingCartList.find((it) => it.id === item.id)
			if (sameItem != null) {
				if (sameItem.id === item.id) {
					const objIndex = shoppingCartList.findIndex((obj) => obj.id == sameItem.id)
					shoppingCartList[objIndex].quantity++
					renderCart(shoppingCartList)
					return
				}
			}

			shoppingCartList.push(item)
			renderCart(shoppingCartList)

			showCart()
		}
		if (e.target.matches("[data-remove-from-cart-button]")) {
			const cartItem = e.target.closest("[data-cart-item-id]")
			removeItemFromCart(cartItem)
		}
	})
}

function removeItemFromCart(cartItem) {
	const itemId = parseInt(cartItem.dataset.cartItemId)
	shoppingCartList = shoppingCartList.filter((item) => {
		if (item.id !== itemId) {
			return item
		} else {
			item.quantity = 1
		}
	})
	if (shoppingCartList.length === 0) {
		hideCart()
	}

	renderCart(shoppingCartList)
}

function renderCartItem(item) {
	const cartItemTemplateClone = cartItemTemplate.content.cloneNode(true)

	const cartItemId = cartItemTemplateClone.querySelector("[data-cart-item-id]")
	cartItemId.dataset.cartItemId = item.id

	const cartItemImage = cartItemTemplateClone.querySelector("[data-cart-item-image]")
	cartItemImage.src = `${IMAGE_SRC}/${item.imageColor}/${item.imageColor}`

	const cartItemName = cartItemTemplateClone.querySelector("[data-cart-item-name]")
	cartItemName.innerText = item.name

	if (item.quantity > 1) {
		const cartItemQuantity = cartItemTemplateClone.querySelector("[cart-item-quantity]")
		cartItemQuantity.innerText = `x${item.quantity}`
	} else {
		const cartItemQuantity = cartItemTemplateClone.querySelector("[cart-item-quantity]")
		cartItemQuantity.innerText = ``
	}

	const cartItemPrice = cartItemTemplateClone.querySelector("[data-cart-item-price]")
	cartItemPrice.innerText = formatCurrency(item.priceCents / 100)

	cartItemsContainer.appendChild(cartItemTemplateClone)

	cartTotalPrice.innerText = formatCurrency(
		shoppingCartList
			.map((item) => item.priceCents * item.quantity)
			.reduce((prev, next) => prev + next, 0) / 100
	)
}

function renderCart(shoppingCartList) {
	cartItemsContainer.innerHTML = ""
	shoppingCartList.forEach((item) => {
		renderCartItem(item)
	})
	sessionStorage.setItem(key, JSON.stringify(shoppingCartList))
	redDot.innerText = shoppingCartList
		.map((item) => item.quantity)
		.reduce((prev, next) => prev + next, 0)
}

function hideCart() {
	cart.classList.add("invisible")
	cartButton.classList.add("invisible")
}

function showCart() {
	cartButton.classList.remove("invisible")
}

function loadCart() {
	const list = JSON.parse(sessionStorage.getItem(key))
	return list
}
