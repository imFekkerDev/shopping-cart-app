const button = document.getElementById("button");
const setChildBtn = document.getElementById("button2");
const setLiChild = document.getElementById("setLiBtn");
const removeDivChildBtn = document.getElementById("removeChildDiv");
const addItemBtn = document.getElementById("addItemBtn");
const searchBtn = document.getElementById("searchBtn"); //searchBar
const saveToLocalBtn = document.getElementById("saveToLocal"); //save to local storage
const showFromLocalBtn = document.getElementById("showFromLocal");
const searchBar = document.getElementById("searchBar"); //search bar button
const showProdUlBtn = document.getElementById("showProdUl");
const thisDiv = document.getElementById("thisDiv");
const ul = document.getElementById("ul"); //const variables can't be redeclared
const productsUl = document.getElementById("productsUl");
let count = 0; //let variables CAN be redeclared

const shoppingCart = {
    items: [
        {itemName: "Laptop", category: "Electronics", price: 2500, stock: true},
        {itemName: "Desktop", category: "Electronics", price: 3500, stock: true}
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

//Object prototypal testing
const secondCart = Object.create(shoppingCart);
secondCart.buy = function(){
    console.log();
}

//Check if a certain element exists:
if (!button || !setChildBtn || !setLiChild || !ul){
    console.error("This element doesn't exist");
}

button.addEventListener('click', function(){
    console.log("Hello World");
    this.textContent = "Hello World"
    console.log(this);
    
    if (this.style.backgroundColor == 'red'){
        this.style.backgroundColor = "cyan"
    } else {
        this.style.backgroundColor = "red"
    }
});

setChildBtn.addEventListener('click', function(){
    const paragraph = document.createElement("p");
    paragraph.textContent = `Paragraph number ${count}`;
    thisDiv.appendChild(paragraph);
    count++;
});

showProdUlBtn.addEventListener('click', function(){
    shoppingCart.listAvailableProductsGUI();
});

removeDivChildBtn.addEventListener('click', function(){
    if (thisDiv.lastChild){
        thisDiv.lastChild.remove();
        count--;
    } else {
        console.log("There are no paragraphs left");
    }
});

setLiChild.addEventListener('click', function(){
    const child = document.createElement("li");
    child.textContent = "Excuse me?"
    ul.appendChild(child);
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

                savedItem = {
                    name: name,
                    price: price
                }

                if (localStorage.getItem(savedItem.name)){
                    alert("This item is already stored in local storage!!");
                    return;
                }

                localStorage.setItem(savedItem.name, JSON.stringify(savedItem)); //To finish
                alert("Item salvo no local storage!");
                console.log("Item salvo no local storage!");
            } else alert("Item não encontrado no Banco de Dados e, portanto, não salvo");
        })

    }
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
                }
            }
        }
    }
});

//functions:
function searchForProduct(product){
    const theProduct = shoppingCart.items.find(item => item.itemName.toLowerCase().includes(product.toLowerCase()))
    const division = document.createElement("div");
    division.classList.add('    division')
    division.textContent = `${theProduct.itemName}: R$ ${theProduct.price}`;
    thisDiv.appendChild(division);
}

function savetoLocalStorage(){
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart.items));
    alert("Saved!");
}