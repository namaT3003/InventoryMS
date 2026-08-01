let allProducts = [];

let loggedInUser = localStorage.getItem("userId");

if (!loggedInUser) {
    window.location.href = "login.html";
}

let userName = localStorage.getItem("fullName");
document.getElementById("welcomeUser").innerText = "Welcome, " + userName + " !";

let editingProductId = null;

let formThing = document.getElementById("productForm");
let logoutWala = document.getElementById("logoutButton");

logoutWala.addEventListener("click", logoutUser);
formThing.addEventListener("submit", addProduct);

showProducts();

async function addProduct(event) {

    event.preventDefault();

    let nameValue = document.getElementById("productName").value;
    let categoryValue = document.getElementById("productCategory").value;
    let quantityValue = document.getElementById("productQuantity").value;
    let priceValue = document.getElementById("productPrice").value;

    if (
        nameValue === "" ||
        categoryValue === "" ||
        quantityValue === "" ||
        priceValue === ""
    ) {

        alert("Please fill all the fields.");
        return;

    }

    if (quantityValue <= 0) {

        alert("Quantity must be greater than 0.");
        return;

    }

    if (!Number.isInteger(Number(quantityValue))) {

        alert("Quantity must be a whole number.");
        return;

    }

    if (priceValue <= 0) {

        alert("Price must be greater than 0.");
        return;

    }

    let userId = localStorage.getItem("userId");

    let url = "http://localhost:5000/products";
    let method = "POST";

    if (editingProductId) {

        url = "http://localhost:5000/products/" + editingProductId;
        method = "PUT";

    }

    let answer = await fetch(url, {

        method: method,

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            name: nameValue,
            category: categoryValue,
            quantity: quantityValue,
            price: priceValue,
            userId: userId

        })

    });

    if (answer.ok) {

        alert(editingProductId ? "Product Updated Successfully!" : "Product Added Successfully!");

        document.getElementById("productName").value = "";
        document.getElementById("productCategory").value = "";
        document.getElementById("productQuantity").value = "";
        document.getElementById("productPrice").value = "";

        editingProductId = null;

        document.querySelector("#productForm button").innerText = "Add Product";

        showProducts();

    }

    else {

        alert("Something went wrong.");

    }

}

async function showProducts() {

    let userId = localStorage.getItem("userId");

    let answer = await fetch(`http://localhost:5000/products?userId=${userId}`);

    allProducts = await answer.json();

    document.getElementById("productCount").innerText = allProducts.length;

    let lowNumber = 0;

    let categoryList = [];

    let totalInventoryValue = 0;

    let totalPrice = 0;

    let highestStock = null;

    let expensiveProduct = null;

    for(let oneItem of allProducts){

        if(oneItem.quantity < 10){

            lowNumber++;

        }

        if(!categoryList.includes(oneItem.category)){

            categoryList.push(oneItem.category);

        }

        totalInventoryValue += oneItem.price * oneItem.quantity;

        totalPrice += Number(oneItem.price);

        if(highestStock == null || oneItem.quantity > highestStock.quantity){

            highestStock = oneItem;

        }

        if(expensiveProduct == null || oneItem.price > expensiveProduct.price){

            expensiveProduct = oneItem;

        }

    }

    document.getElementById("lowStock").innerText = lowNumber;

    document.getElementById("categoryCount").innerText = categoryList.length;

    /* ---------- LOW STOCK ALERT ---------- */

    let alertBox = document.getElementById("stockAlert");

    alertBox.style.display = "block";

    if(lowNumber>0){

        alertBox.className="stockAlert stockDanger";

        alertBox.innerHTML=`⚠ ${lowNumber} product(s) are running low on stock.`;

    }

    else{

        alertBox.className="stockAlert stockSafe";

        alertBox.innerHTML=`✅ Great! All products are sufficiently stocked.`;

    }

    /* ---------- ANALYTICS ---------- */

    document.getElementById("inventoryValue").innerText =
    "₹"+totalInventoryValue;

    document.getElementById("averagePrice").innerText =
    allProducts.length==0 ?
    "₹0"
    :
    "₹"+Math.round(totalPrice/allProducts.length);

    document.getElementById("highestStock").innerText =
    highestStock ?
    highestStock.name+" ("+highestStock.quantity+")"
    :
    "-";

    document.getElementById("expensiveProduct").innerText =
    expensiveProduct ?
    expensiveProduct.name+" (₹"+expensiveProduct.price+")"
    :
    "-";

    displayProducts(allProducts);

}

async function editProduct(productId) {

    let userId = localStorage.getItem("userId");

    let answer = await fetch(`http://localhost:5000/products?userId=${userId}`);

    let allProducts = await answer.json();

    let product = allProducts.find(function (item) {

        return item._id === productId;

    });

    document.getElementById("productName").value = product.name;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productQuantity").value = product.quantity;
    document.getElementById("productPrice").value = product.price;

    editingProductId = productId;

    document.querySelector("#productForm button").innerText = "Update Product";

}

async function deleteProduct(productId) {

    let answer = confirm("Do you want to delete this product?");

    if (!answer) {

        return;

    }

    let deleteAnswer = await fetch("http://localhost:5000/products/" + productId, {

        method: "DELETE"

    });

    if (deleteAnswer.ok) {

        alert("Product Deleted Successfully!");

        showProducts();

    }

    else {

        alert("Cannot Delete Product.");

    }

}

function logoutUser() {

    let answer = confirm("Do you want to logout?");

    if (answer) {

        localStorage.removeItem("userId");
        localStorage.removeItem("fullName");

        window.location.href = "index.html";

    }

}

function displayProducts(products){

    let myTable=document.getElementById("tableBody");

    myTable.innerHTML="";

    if(products.length===0){

        myTable.innerHTML=

        `
        <tr>

            <td colspan="5">

                No Products Found

            </td>

        </tr>

        `;

        return;

    }

    for(let oneItem of products){

        let rowClass="";
        let quantityHTML=oneItem.quantity;

        if(oneItem.quantity<10){

            rowClass="lowStockRow";

            quantityHTML=
            `⚠️ <span class="lowQuantity">${oneItem.quantity}</span>`;

        }

        myTable.innerHTML+=`

        <tr class="${rowClass}">

            <td>${oneItem.name}</td>

            <td>${oneItem.category}</td>

            <td>${quantityHTML}</td>

            <td>₹${oneItem.price}</td>

            <td>

                <button class="editBtn"
                onclick="editProduct('${oneItem._id}')">

                    Edit

                </button>

                <button class="deleteBtn"
                onclick="deleteProduct('${oneItem._id}')">

                    Delete

                </button>

            </td>

        </tr>

        `;

    }

}

document.getElementById("searchBox").addEventListener("input", filterProducts);

document.getElementById("filterType").addEventListener("change", filterProducts);

function filterProducts(){

    let searchText = document
        .getElementById("searchBox")
        .value
        .toLowerCase()
        .trim();

    let filterType = document
        .getElementById("filterType")
        .value;

    let filteredProducts = allProducts.filter(function(product){

        let value = "";

        if(filterType === "name"){

            value = product.name;

        }

        else if(filterType === "category"){

            value = product.category;

        }

        else if(filterType === "price"){

            value = product.price.toString();

        }

        else if(filterType === "quantity"){

            value = product.quantity.toString();

        }

        return value
            .toLowerCase()
            .includes(searchText);

    });

    displayProducts(filteredProducts);

}