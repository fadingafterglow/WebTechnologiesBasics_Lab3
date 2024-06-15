let pivot;
window.addEventListener("load", () => {
        pivot = new WebDataRocks({
        	container: "#wdr-component",
            beforetoolbarcreated: customizeToolbar,
        	toolbar: true,
        	report: {
        	    	dataSource: {
                        dataSourceType: "json",
        	    		data: prepareTableData()
        	    	},
                    slice: {
                        rows: [
                            {
                                uniqueName: "type"
                            },
                            {
                                uniqueName: "name"
                            }
                        ],
                        columns: [
                            {
                                uniqueName: "Measures"
                            }
                        ],
                        measures: [
                            {
                                uniqueName: "Total amount",
                                formula: "sum(\"amount\") ",
                                caption: "Загальна кількість"
                            },
                            {
                                uniqueName: "Total weight",
                                formula: "sum(\"weight\") * sum(\"amount\") ",
                                individual: true,
                                format: "g",
                                caption: "Загальна вага",
                            },
                            {
                                uniqueName: "Average diameter",
                                formula: "average(\"diameter\") ",
                                format: "cm",
                                caption: "Середній діаметер піци"
                            },
                            {
                                uniqueName: "Average price",
                                formula: "average(\"price\") ",
                                format: "UAH",
                                caption: "Середня ціна піци"
                            },
                            {
                                uniqueName: "Total price",
                                formula: "sum(\"price\") * sum(\"amount\") ",
                                individual: true,
                                format: "UAH",
                                caption: "Загальна вартість",
                            }
                        ]
                    },
                    formats: [
                        {
                            name: "UAH",
                            decimalPlaces: 2,
                            currencySymbol: " ₴",
                            currencySymbolAlign: "right"
                        },
                        {
                            name: "g",
                            currencySymbol: " гр",
                            currencySymbolAlign: "right"
                        },
                        {
                            name: "cm",
                            maxDecimalPlaces: 1,
                            currencySymbol: " см",
                            currencySymbolAlign: "right"
                        }
                    ],
                    options: {
                        grid: {
                            showHeaders: false,
                            type: "classic",
                            title: "Звіт по обраним піцам"
                        }
                    }
        	}
        });
        document.getElementById("wdr-pivot-view").style.zIndex = 0;
    }
);

function customizeToolbar(toolbar) {
    const tabs = toolbar.getTabs();
    toolbar.getTabs = function() {
        delete tabs[0];
        delete tabs[1];
        delete tabs[2];
        delete tabs[4].menu[0];
        delete tabs[6];
        return tabs;
    }
}

function prepareTableData() {
    const pizzas = Object.values(localStorage).map(v => JSON.parse(v));
    pizzas.forEach(o => {delete o.index; delete o.icon;});
    const mappingObject = {
        name: {
            caption: "Назва",
            type: "string"
        },
        diameter: {
            caption: "Діаметер",
            type: "number" 
        },
        weight: {
            caption: "Вага",
            type: "number" 
        },
        price: {
            caption: "Ціна",
            type: "number" 
        },
        amount: {
            caption: "Кількість",
            type: "number" 
        },
        type: {
            caption: "Тип",
            type: "string" 
        }
    }
    pizzas.unshift(mappingObject);
    return pizzas;
}