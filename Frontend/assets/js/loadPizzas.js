window.addEventListener("load", load)

async function load() {
    const pizzas = await fetchData();
    const fragment = document.createDocumentFragment();
    for (const pizza of pizzas)
        fragment.appendChild(createPizzaCard(pizza))
    const container = document.getElementById("pizza-container");
    container.appendChild(fragment);
}

async function fetchData() {
    const response = await fetch("assets/js/pizzaList.json");
    const json = await response.json();
    return json;
}

function createPizzaCard(pizzaInfo) {
    const card = cloneTemplate(document, "pizza-card-template");
    loadID(card, pizzaInfo);
    loadTag(card, pizzaInfo);
    loadImage(card, pizzaInfo);
    loadName(card, pizzaInfo);
    loadCategory(card, pizzaInfo);
    loadIngridients(card, pizzaInfo);
    loadSizes(card, pizzaInfo);
    return card;
}

function loadID(card, pizzaInfo) {
    card.querySelector(".pizza-card").id = pizzaInfo["id"];
}

function loadTag(pizzaCard, pizzaInfo) {
    const tag = pizzaCard.querySelector(".tag");
    if (pizzaInfo["is_new"]) {
        tag.innerText = "Нова";
        tag.classList.add("new");
    }
    else if (pizzaInfo["is_popular"]) {
        tag.innerText = "Популярна";
        tag.classList.add("popular");
    }
    else
        tag.classList.add("none");
}

function loadImage(pizzaCard, pizzaInfo) {
    const img = pizzaCard.querySelector("img");
    img.src = pizzaInfo["icon"];
}

function loadName(pizzaCard, pizzaInfo) {
    loadText(pizzaCard, ".name", pizzaInfo["title"]);
}

function loadCategory(pizzaCard, pizzaInfo) {
    loadText(pizzaCard, ".category", pizzaInfo["type"]);
}

function loadIngridients(pizzaCard, pizzaInfo) {
    loadText(pizzaCard, ".ingridients", getAllIngridients());

    function getAllIngridients() {
        const content = pizzaInfo["content"];
        let allIngridients = "";
        for (const type in content)
            for (const ingridient of content[type])
                allIngridients += ingridient + ", ";
        let capitalLetter = allIngridients.charAt(0).toUpperCase();
        allIngridients = capitalLetter + allIngridients.substring(1, allIngridients.length-2);
        return allIngridients;
    }
}

function loadSizes(pizzaCard, pizzaInfo) {
    const sizes = pizzaCard.querySelector(".properties");
    loadSize("small_size");
    loadSize("big_size");

    function loadSize(sizeName) {
        const sizeInfo = pizzaInfo[sizeName];
        if (typeof sizeInfo === "undefined")
            return;
        const size = cloneTemplate(pizzaCard, "property-template");
        loadText(size, ".diameter", sizeInfo["size"]);
        loadText(size, ".weight", sizeInfo["weight"]);
        loadText(size, ".price > p:first-of-type", sizeInfo["price"]);
        sizes.appendChild(size);
    }
}

function cloneTemplate(context, templateID) {
    return context.getElementById(templateID).content.cloneNode(true);
}

function loadText(context, selector, value) {
    const element = context.querySelector(selector);
    element.innerText = value;
}