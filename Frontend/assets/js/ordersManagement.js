var orderIndex;
window.addEventListener("load", loadOrdersFromStorage)
document.getElementById("clear-orders-button").addEventListener("click", clearOrders);

function loadOrdersFromStorage() {
    const orders = Object.values(localStorage).map(v => JSON.parse(v)).sort((a, b) => a.index - b.index);
    orderIndex = orders[orders.length-1]?.index + 1 || 0;
    orders.forEach(info => createOrder(info));
    calculateTotalPrice();
}

function addPizzaOrder(pizzaInfo, size) {
    const orderName = calculateOrderName(pizzaInfo, size);
    if (localStorage.getItem(orderName)) 
        changeOrderAmount(orderName, 1);
    else {
        const orderInfo = new OrderInfo(pizzaInfo, size)
        createOrder(orderInfo);
        localStorage.setItem(orderInfo.name, JSON.stringify(orderInfo));
        calculateTotalPrice();
    }
}

function calculateOrderName(pizzaInfo, size) {
    let name = pizzaInfo["title"];
    switch (size) {
        case "small_size": 
            name += " (Мала)";
            break;
        case "big_size":
            name += " (Велика)";
            break;
    }
    return name;
}

function OrderInfo(pizzaInfo, size) {
    this.name = calculateOrderName(pizzaInfo, size);
    this.icon = pizzaInfo["icon"];
    const sizeInfo = pizzaInfo[size];
    this.diameter = sizeInfo["size"];
    this.weight = sizeInfo["weight"];
    this.price = sizeInfo["price"];
    this.amount = 1;
    this.index = orderIndex++;
}

function createOrder(orderInfo) {
    const order = cloneTemplate(document, "order-template");
    loadOrderID(order, orderInfo);
    loadOrderName(order, orderInfo);
    loadOrderImage(order, orderInfo);
    loadOrderProperties(order, orderInfo);
    attachOrderEventListeners(order, orderInfo);
    document.getElementById("order-container").appendChild(order);
    changeOrdersQuantity(1);
}

function loadOrderID(order, orderInfo) {
    order.querySelector(".order").id = orderInfo.name;
}

function loadOrderName(order, orderInfo) {
    loadText(order, ".name", orderInfo.name);
}

function loadOrderImage(order, orderInfo) {
    const img = order.querySelector(".order > img");
    img.src = orderInfo.icon;
}

function loadOrderProperties(order, orderInfo) {
    loadText(order, ".diameter", orderInfo.diameter);
    loadText(order, ".weight", orderInfo.weight);
    loadText(order, ".price", orderInfo.price * orderInfo.amount);
    loadText(order, ".amount", orderInfo.amount);
}

function attachOrderEventListeners(order, orderInfo) {
    order.querySelector(".decrease-btn").addEventListener("click", () => changeOrderAmount(orderInfo.name, -1));
    order.querySelector(".increase-btn").addEventListener("click", () => changeOrderAmount(orderInfo.name, 1));
    order.querySelector(".delete-btn").addEventListener("click", () => removeOrder(orderInfo.name));
}

function changeOrderAmount(orderName, delta) {
    const order = document.getElementById(orderName);
    const amountElement = order.querySelector(".amount"); 
    const oldAmount = JSON.parse(localStorage.getItem(orderName)).amount;
    const newAmount = oldAmount + delta;
    if (newAmount <= 0) {
        removeOrder(orderName);
    }
    else {
        let orderInfo = localStorage.getItem(orderName);
        orderInfo = JSON.parse(orderInfo);
        orderInfo.amount = newAmount;
        localStorage.setItem(orderName, JSON.stringify(orderInfo));
        amountElement.innerText = newAmount;
        order.querySelector(".price").innerText = newAmount * orderInfo.price; 
    }
    calculateTotalPrice();
}

function changeOrdersQuantity(delta) {
    const quantityElement = document.getElementById("orders-quantity"); 
    const oldAmount = Number.parseInt(quantityElement.innerText);
    quantityElement.innerText = oldAmount + delta;
}


function removeOrder(orderName) {
    localStorage.removeItem(orderName);
    document.getElementById(orderName).remove();
    changeOrdersQuantity(-1);
    calculateTotalPrice();
}

function clearOrders() {
    localStorage.clear();
    orderIndex = 0;
    document.querySelectorAll("#order-container > .order").forEach(o => o.remove());
    document.getElementById("total-price").innerText = 0;
    document.getElementById("orders-quantity").innerText = 0; 
}

function calculateTotalPrice() {
    const orders = Object.values(localStorage).map(o => JSON.parse(o))
    let totalPrice = 0;
    for (const order of orders)
        totalPrice += order.amount * order.price;
    document.getElementById("total-price").innerText = totalPrice;
}