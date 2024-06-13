window.addEventListener("load", loadPizzas)

async function loadPizzas() {
    const pizzas = await fetchData();
    const fragment = document.createDocumentFragment();
    for (const pizza of pizzas)
        fragment.appendChild(createPizzaCard(pizza))
    const container = document.getElementById("pizza-container");
    container.appendChild(fragment);
    document.getElementById("pizzas-quantity").innerText = pizzas.length;
}

async function fetchData() {
    const response = await fetch("assets/js/pizzaList.json");
    const json = await response.json();
    return json;
}

function createPizzaCard(pizzaInfo) {
    const card = cloneTemplate(document, "pizza-card-template");
    loadPizzaID(card, pizzaInfo);
    loadPizzaCategories(card, pizzaInfo);
    loadPizzaTag(card, pizzaInfo);
    loadPizzaImage(card, pizzaInfo);
    loadPizzaName(card, pizzaInfo);
    loadPizzaCategory(card, pizzaInfo);
    loadPizzaIngridients(card, pizzaInfo);
    loadPizzaSizes(card, pizzaInfo);
    return card;
}

function loadPizzaID(card, pizzaInfo) {
    card.querySelector(".pizza-card").id = pizzaInfo["id"];
}

function loadPizzaCategories(card, pizzaInfo) {
    card.querySelector(".pizza-card").setAttribute("data-categories", pizzaInfo["categories"]);
}

function loadPizzaTag(pizzaCard, pizzaInfo) {
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
        tag.classList.add("hidden");
}

function loadPizzaImage(pizzaCard, pizzaInfo) {
    const img = pizzaCard.querySelector("img");
    img.src = pizzaInfo["icon"];
}

function loadPizzaName(pizzaCard, pizzaInfo) {
    loadText(pizzaCard, ".name", pizzaInfo["title"]);
}

function loadPizzaCategory(pizzaCard, pizzaInfo) {
    loadText(pizzaCard, ".category", pizzaInfo["type"]);
}

function loadPizzaIngridients(pizzaCard, pizzaInfo) {
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

function loadPizzaSizes(pizzaCard, pizzaInfo) {
    const sizes = pizzaCard.querySelector(".properties");
    loadPizzaSize("small_size");
    loadPizzaSize("big_size");

    function loadPizzaSize(sizeName) {
        const sizeInfo = pizzaInfo[sizeName];
        if (typeof sizeInfo === "undefined")
            return;
        const size = cloneTemplate(pizzaCard, "property-template");
        loadText(size, ".diameter", sizeInfo["size"]);
        loadText(size, ".weight", sizeInfo["weight"]);
        loadText(size, ".price > p:first-of-type", sizeInfo["price"]);
        size.querySelector(".action-button").addEventListener("click", () => addPizzaOrder(pizzaInfo, sizeName));
        sizes.appendChild(size);
    }
}
