window.addEventListener("load", createFilters);

function createFilters() {
    const filters = document.querySelectorAll(".filters > input");
    filters.forEach(f => f.addEventListener("change", () => applyFilter(f.id)));
}

function applyFilter(category) {
    const pizzaCards = document.querySelectorAll("#pizza-container .pizza-card");
    let filteredPizzas = 0;
    for (const pizzaCard of pizzaCards) {
        const categories = pizzaCard.getAttribute("data-categories");
        if (category === "all" || categories.includes(category)) {
            pizzaCard.classList.remove("hidden");
            filteredPizzas++;
        }
        else
            pizzaCard.classList.add("hidden");
    }
    document.getElementById("pizzas-quantity").innerText = filteredPizzas;
}