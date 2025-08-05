//UI Variables
const removeDivChildBtn = document.getElementById("removeChildDiv");
const addItemBtn = document.getElementById("addItemBtn");
const searchBtn = document.getElementById("searchBtn"); //searchBar
const saveToLocalBtn = document.getElementById("saveToLocal"); //save to local storage
const showFromLocalBtn = document.getElementById("showFromLocal");
const checkHistoryBtn = document.getElementById('checkHistoryBtn'); //Check the History
const closeModalBtn = document.getElementById('closeModalBtn'); //Close Modal Button
const searchBar = document.getElementById("searchBar"); //search bar button
const showProdUlBtn = document.getElementById("showProdUl");
const removeFromLocalBtn = document.getElementById("removeFromLocal");
const checkDoneActionsBtn = document.getElementById("checkDoneActions");
const undoBtn = document.getElementById("undoBtn"); //undo action button
const thisDiv = document.getElementById("thisDiv");
const ul = document.getElementById("ul"); //const variables can't be redeclared
const productsUl = document.getElementById("productsUl");
const modalContent = document.getElementById('modal-content');
const searchResults = document.getElementById('searchResults');
const doneActionsSidebar = document.getElementById("done-actions-sidebar");
const doneActionsContent = document.getElementById("done-actions-content");

//Filters:
const filterBtn = document.getElementById("filterBtn"); //apply filter button
const onOffFilter = document.getElementById("onOffFilter"); //On/Off Filters Label
const filterDiv = document.getElementById("filter-division");
const categoryCB = document.getElementById("categoryCB"); //Category Filter Checkbox
const categories = document.getElementById('categories'); //rest of categories checkbox
const inStockCB = document.getElementById("inStockCB"); //In Stock Filter Checkbox
const elecCB = document.getElementById('elecCB'); //Electronics Checkbox Filter
const styleCB = document.getElementById('styleCB'); //Style Checkbox Filter
//Other variables
let count = 0; //let variables CAN be redeclared
let actions = [] //Actions in the History | TO BE FINISHED

//Undo/Redo Actions Logic
let undoStack = []; //Done actions that can be undone;
let redoStack = []; //Undone actions that can be redone;

const shoppingCart = {
    items: [
        {itemName: "Laptop", category: "Electronics", price: 2500, stock: true},
        {itemName: "Desktop", category: "Electronics", price: 3500, stock: true},
        {itemName: "Purse", category: "Style", price: 40, stock: true},
        {itemName: "Desk", category: "Personal Space", price: 200, stock:true}
    ],
    addItem: function(itemName){
        const userResponse = window.prompt(`Would you like to add ${itemName} to the cart?`);
        const userPrice = window.prompt("What is its price?");
        const category = window.prompt("What's the product's category?");
        const stock = window.prompt("Is this product in stock?");
        if (price.length == 0){
            alert("You must put in the price of the product!");
        } else if (isNaN(userPrice)){
            console.error("The price must be a number!");
        } else if (category.length == 0){
            console.error("You must put in the category, please!");
        } else if (stock.startsWith("n")){
            console.log("If an item is not in stock, you can't add it to the cart");
        } else if (userResponse.toLowerCase().startsWith("y")){
            this.items.push({itemName, category, price: Number(userPrice), stock: true})
            undoStack.push(`${itemName} added to the Cart!`);
            setTimeout(() => {
                confirm(`${itemName} added to the Cart!`);
            }, 5000);
            
        }
    },
    removeItem(itemName){
        this.items = this.items.filter(i => !i.itemName.includes(itemName));
        alert(`${itemName} deleted successfuly`);
    },
    calculateTotal: function(){
        const totalPrice = this.items.reduce((total, item) => total + item.price, 0);
        console.log(`Your cart's total price is: ${totalPrice}`);
    },
    listAvailableProducts(){
        const products = this.items.filter(p => p.stock == true);
        console.log(products.map(p => `${p.itemName} - ${p.category} - Price: ${p.price}`))
    },
    listAvailableProductsGUI(){
        const products = this.items.filter(p => p.stock == true);
        const totalPrice = this.items.reduce((total, curr) => total + curr.price, 0);
        const priceLi = document.createElement("p");
        products.forEach(i => {
            const li = document.createElement("li");
            li.textContent = `${i.itemName}: ${i.price} - ${i.stock}`;
            thisDiv.appendChild(li);
        })
        priceLi.textContent = `R$ ${totalPrice}`;
        thisDiv.appendChild(priceLi);
    },
    showItems(){
        console.log(this.items.map((item) => `$${item.price}: ${item.name}`).join(", "));
    }
}

//IMPORTANT
showProdUlBtn.addEventListener('click', function(){
    shoppingCart.listAvailableProductsGUI();
});

//Price formater (Intl)
const formaterBRA = new Intl.NumberFormat('pt-BR', {style: "currency", currency: "BRL"});
const formaterUSA = new Intl.NumberFormat('en-US', {style: "currency", currency: "USD"});

searchBar.addEventListener('input', () => {
    
    const query = searchBar.value.toLowerCase().trim();
    searchResults.innerHTML = '';
    if (query.length === 0) return;

    const products = shoppingCart.items.filter(i => i.itemName.toLowerCase().includes(query))

    products.forEach(i => {
        const suggestion = document.createElement('div')
        suggestion.classList.add('searchChild');
        suggestion.textContent = `${i.itemName} (${i.category}) - ${formaterBRA.format(i.price)}`
        searchResults.appendChild(suggestion);
    })

    if (products.length === 0){
        const advice = document.createElement('div');
        advice.classList.add('searchChild');
        advice.textContent = 'Nenhum item encontrado.'
        searchResults.appendChild(advice);
    }
});

searchBtn.addEventListener('click', function(){
    const text = searchBar.value;
    if (text.length == 0){
        alert("Please, type in something to search for.");
        console.log("Please, type in something to search for.");
        searchBar.focus();
        return;
    } else if (!shoppingCart.items.filter(i => i.itemName.toLowerCase().includes(text.toLowerCase()))){
        alert("Sorry, but this product doesn't exist.");
        searchBar.focus();
    }
    if (shoppingCart.items.filter(i => i.itemName.includes(text))){
        if (thisDiv.children) thisDiv.innerHTML = '';
        searchForProduct(text);
    }
});

const values = [];
saveToLocalBtn.addEventListener('click', function(){
    if (!thisDiv.children) alert("There are no items to be saved!");
    const response = window.prompt("Would you like to save these items to the local storage?");
    if (response.toLowerCase().startsWith('n')){
        searchBar.focus();
    } else if (response.toLowerCase().startsWith('y')){
        const items = thisDiv.children;
        
        Array.from(items).forEach((itemElement, index) => {
            const textOnDiv = itemElement.textContent.toLowerCase();

            const matchedItem = shoppingCart.items.find(i => textOnDiv.toLowerCase().includes(i.itemName.toLowerCase()));

            if (matchedItem){
                const name = matchedItem.itemName;
                const price = matchedItem.price;

                const savedItem = {
                    name: name,
                    price: price
                }

                if (localStorage.getItem(savedItem.name)){
                    alert("This item is already stored in local storage!!");
                    return;
                }
                values.push(savedItem.name)
                values.push(savedItem);

                doAct(values, 'ADD_TO_LOCALSTG');
            } else alert("Item não encontrado no Banco de Dados e, portanto, não salvo");
        })

    }
});

removeFromLocalBtn.addEventListener('click', function(){
    const item = window.prompt("What item would you like to remove from the local storage?")
    .trim()
    .toLowerCase();

    for (let i = 0; i < localStorage.length; i++){
        const key = localStorage.key(i);

        if (key.toLowerCase() == item){
            localStorage.removeItem(key)
            alert(`item '${key}' successfully removed from the Local Storage.`);
            return;
        }
    }

    alert("This item doesn't exist in the local storage!");
});

let availableShowBtn = true;

showFromLocalBtn.addEventListener('click', function(){
    if (thisDiv.children.length >= 1){
        availableShowBtn = false;
    } else {
        availableShowBtn = true;
    }

    if (!availableShowBtn){
        alert("couldn't")
        return;
    };

    if (availableShowBtn){
        for (let i = 0; i < localStorage.length; i++){
            if (shoppingCart.items.some(i => i.itemName.includes(localStorage.key(i)))){
                const item = JSON.parse(localStorage.getItem(localStorage.key(i)));

                if (item && item.name && item.price){
                    const div = document.createElement('div');
                    div.textContent = `${item.name} - ${item.price}`
                    div.classList.add('division')
                    thisDiv.appendChild(div);
                    console.log(item + "fetched from local storage.");
                    actions.push(`${item} fetched from local storage.`);
                }
            }
        }
    }
});

let isDoneActionsBarShowed = false;
checkDoneActionsBtn.addEventListener('click', function(){
    
    if (!isDoneActionsBarShowed){

        isDoneActionsBarShowed = true;
        doneActionsSidebar.style.display = "flex";

        if (actions.length > 0){
            actions.forEach(act => {
                const division = document.createElement('div');
                const undoBtn = document.createElement('button');

                undoBtn.textContent = "Undo";
                undoBtn.setAttribute('id', 'undoBtn');

                undoBtn.addEventListener('click', function(){
                    doneActionsContent.removeChild(division);
                });

                division.classList.add('division');

                division.textContent = act;
                division.appendChild(undoBtn);
                doneActionsContent.appendChild(division);
            });
        }
    } else {
        isDoneActionsBarShowed = false;
        doneActionsSidebar.style.display = "none";
    }
});

checkHistoryBtn.addEventListener('click', function(){
    modalContent.style.display = 'block'
    setHistory();
});

let isFilterOn = false;
filterBtn.addEventListener('click', function(){

    if (!isFilterOn){
        isFilterOn = true;
        onOffFilter.textContent = "On"
        filterBtn.style.backgroundColor = "green"
        filterDiv.style.display = "block"
    } else {
        isFilterOn = false;
        onOffFilter.textContent = "Off"
        filterBtn.style.backgroundColor = "red"
        filterDiv.style.display = "none"
        setCheckboxesNotChecked()
        thisDiv.innerHTML = ""
    }
});

closeModalBtn.addEventListener('click', function(){
    modalContent.style.display = 'none';
});

categoryCB.addEventListener('change', applyFilters);
inStockCB.addEventListener('change', applyFilters);
elecCB.addEventListener('change', applyFilters);
styleCB.addEventListener('change', applyFilters);

document.querySelectorAll("#filters input[type='checkbox']").forEach(cb => {
    cb.addEventListener('change', () => {
        const someChecked = Array.from(document.querySelectorAll("#filters input[type='checkbox']")).some(checkb => checkb.checked);

        if (!someChecked){
            thisDiv.innerHTML = "";
        } else {
            applyFilters();
        }
    })
})

//functions:
function searchForProduct(product){
    const theProduct = shoppingCart.items.find(item => item.itemName.toLowerCase().includes(product.toLowerCase()))
    const division = document.createElement("div");
    division.classList.add('division');
    division.textContent = `${theProduct.itemName}: R$ ${theProduct.price}`;
    thisDiv.appendChild(division);
}

function savetoLocalStorage(keyName, obj){
    localStorage.setItem(keyName, JSON.stringify(obj));
}

function removeFromLocalStorage(keyName){
    for (let i = 0; i < localStorage.length; i++){
        if (localStorage.key(i).toLowerCase().includes(keyName.toLowerCase())){
            localStorage.removeItem(keyName)
        }
    }
}

function setCheckboxesNotChecked(){
    Array.from(document.querySelectorAll("#filters input[type='checkbox']")).forEach(cb => cb.checked = false)
}

//HISTORY LOGIC - TERMINAR A LÓGICA DE AMOSTRA DAS AÇÕES DO USUÁRIO NO HISTÓRICO ----------------------------------------
/*
const divChildren = Array.from(modalContent.children);
const ignoreThese = Array.from(modalContent.children).filter(child => child.classList.contains('ignore'))
console.log(divChildren);

function setHistory() {
    const toBeDoneActs = [];

    // Pega os filhos atuais da modalContent que você quer ignorar
    const ignoredElements = Array.from(modalContent.children).filter(child =>
        child.classList.contains('ignore')
    );

    // Filtra ações que ainda não estão no histórico e não são ignoradas
    actions.forEach(action => {
        const alreadyInHistory = Array.from(modalContent.children).some(child => 
            child.textContent === action
        );

        if (!alreadyInHistory) {
            toBeDoneActs.push(action);
        }
    });

    // Adiciona novas ações ao modalContent
    toBeDoneActs.forEach(action => {
        const element = document.createElement('div');
        element.textContent = action;
        element.classList.add('division');
        modalContent.appendChild(element);
    });
} */ //---------------------------------------------------------------------------------------------------

//TERMINAR ACIMA

function applyFilters(){
    thisDiv.innerHTML = "";

    let filteredProducts = shoppingCart.items;

    if (categoryCB.checked){
        categories.style.display = "block";

        let checkedCategories = [];
        if (elecCB.checked) checkedCategories.push('electronics');
        if (styleCB.checked) checkedCategories.push('style');

        if (checkedCategories.length > 0){
            filteredProducts = filteredProducts.filter(i => checkedCategories.includes(i.category.toLowerCase()));
        }

    } else {
        categories.style.display = "none";
    }

    if (inStockCB.checked){
        filteredProducts = filteredProducts.filter(i => i.stock == true);
    }

    filteredProducts.forEach(i => {
        const div = document.createElement("div");
        div.textContent = `${i.itemName} (${i.category}) - ${i.stock ? "Available" : "Unavailable"}`;
        div.classList.add("division");
        thisDiv.appendChild(div);
    })
}

function doAct(valuesArr, actionType){

    switch(actionType){
        case 'ADD_TO_LOCALSTG':
                savetoLocalStorage(valuesArr[0], valuesArr[1]);
                const confirmation = confirm(valuesArr[0] + " has been successfully saved to local storage. Click 'CANCEL' to undo.")

                if (!confirmation){
                    removeFromLocalStorage(valuesArr[0])
                    alert(`The item ${valuesArr[0]} hasn't been saved to local storage!`);
                };
                
                values.length = 0;
         break;
    }
}

function undoAction(action){
    undoStack.pop(action)
    redoStack.push(action);
    
    const response = confirm(action + " undone! Redo?");

    if (response){
        doAction(action);
    } else {
        return;
    }
}