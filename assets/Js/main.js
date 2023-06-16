//* URL base
const baseUrl = "https://ecommercebackend.fundamentos-29.repl.co/";
//* Dibujar productos en la web
const productsList = document.querySelector("#products-container");
//* Mostrar y ocultar carrito
const navToggle = document.querySelector(".nav__button--toggle");
const navCar = document.querySelector(".nav__car");
//* Carrito de compras
const car = document.querySelector("#car");
const carList = document.querySelector("#car__list");
//* Vaciar carrito
const emptyCarButton = document.querySelector("#empty-car");
//* Car counter
const carCounter = document.querySelector("#car-counter");
//* Array Carrito
//? Necesitamos tener un array que reciba los elementos que debo introducir en el carrito de compras.
let carProducts = [];
//* Ventana Modal
const modalContainer = document.querySelector("#modal-container");
const modalElement = document.querySelector("#modal-element");
let modalDetails = [];
//* Suma total de valores
const totalValue = document.querySelector("#total-value")
navToggle.addEventListener("click", () => {
    navCar.classList.toggle("nav__car--visible")
})
eventListenersLoader()
function eventListenersLoader() {
    //* Cuando se presione el botón "Add to car"
    productsList.addEventListener("click", addProduct);
    //* Cuando se presione el botón "Delete"
    car.addEventListener("click", deleteProduct);
    //* Cuando se de click al botón Empty Car
    emptyCarButton.addEventListener("click", emptyCar)
    //* Listeners Modal.
    //* Cuando se de click al botón de ver detalles
    productsList.addEventListener("click", modalProduct)
    //* Cuando se de click al botón de cerrar modal.
    modalContainer.addEventListener("click", closeModal)
    //* Se ejecuta cuando carga la página
    document.addEventListener("DOMContentLoaded", () => {
        carProducts = JSON.parse(localStorage.getItem('car')) || [];
        carElementsHTML()
    })
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //* Agregar al carrito desde la ventana modal 🤧
    modalContainer.addEventListener("click", carElementsHTML)
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!    
}
//* Hacer petición a la API de productos
//* 1. Crear una función con la petición:
function getProducts() {
    axios.get(baseUrl)
        .then((response) => {
            const products = response.data
            printProducts(products)
        })
        .catch((error) => {
            console.log(error)
        })
}
getProducts()
//* 2. Renderizar los productos capturados de la API en mi HTML.
function printProducts(products) {
    let html = '';
    for(let product of products) {
        html += `
            <div class="products__element">
                <img src="${product.image}" alt="product_img" class="products__img">
                <h3 class="products__name">${product.name}</h3>
                <div class="products__div">
                    <p class="products__usd">Precio: </p>
                    <p class="products__price">${product.price.toFixed(2)} $</p>
                </div>
                <div class="products__div products__div--flex">
                    <button data-id="${product.id}" class="products__button add_car">
                        <ion-icon name="add-outline" class="add_car"></ion-icon>
                    </button>
                    <button data-id="${product.id}" data-description="${product.description}" class="products__button products__button--search products__details" data-quantity="${product.quantity}">
                        <ion-icon name="search-outline"></ion-icon>
                    </button>
                </div>    
            </div>
        `
    }
    productsList.innerHTML = html
}
//* Agregar los productos al carrito
//* 1. Capturar la información del producto al que se dé click.
function addProduct(event){
    //* Método contains => valída si existe un elemento dentro de la clase.
    if(event.target.classList.contains("add_car")){
        const product = event.target.parentElement.parentElement
        //* parentElement => nos ayuda a acceder al padre inmediatamente superior del elemento.
        carProductsElements(product)
    }
}
//* 2. Debemos transformar la información HTML a un array de objetos.
//* 2.1 Debo validar si el elemento seleccionado ya se encuentra dentro del array del carrito (carProducts). Si existe, le debo sumar una unidad para que no se repita.
function carProductsElements(product){
    const infoProduct = {
        id: product.querySelector('button').getAttribute('data-id'),
        image: product.querySelector('img').src,
        name: product.querySelector('h3').textContent,
        price: product.querySelector('.products__div .products__price').textContent,
        quantity: 1
    }    
    //* Agregar el objeto de infoProduct al array de carProducts, pero hay que validar si el elemento existe o no.
    //? El primer if valída si por lo menos un elemento que se encuentre en carProducts es igual al que quiero enviarle en infoProduct.
    if( carProducts.some( product => product.id === infoProduct.id ) ){ //True or False   
        const productIncrement = carProducts.map(product => {
            if(product.id === infoProduct.id){
                product.quantity++
                return product
            } else {
                return product
            }
        })
        carProducts = [ ...productIncrement ]
    } else {
        carProducts = [ ...carProducts, infoProduct ]
    }    
    carElementsHTML();
}
function carElementsHTML() {
    let total = 0
    let carHTML = '';
    for (let product of carProducts){
        total += Number((product.price) * (product.quantity))
        carHTML += `
        <div class="car__product">
            <div class="car__product__image">
              <img src="${product.image}">
            </div>
            <div class="car__product__description">
              <h4>${product.name}</h4>
              <p>Precio: ${product.price}</p>
              <p>Cantidad: ${product.quantity}</p>
            </div>
            <div class="car__product__button">
                <button class="delete__product" data-id="${product.id}">
                    Borrar Articulo
                </button>
            </div>
        </div>
        <hr>
        `
    }
    carList.innerHTML = carHTML;
    //* Crear suma total del pedido.
    if(carProducts.length > 0){
        totalValue.innerHTML = `<h3>Suma Total: USD ${total.toFixed(2)}</h3>`
    } else {
        totalValue.innerHTML = ""
    }
    let value = 0
    for (let counter of carProducts) {
        value += counter.quantity
    }
    carCounter.innerHTML = `<p>${value}</p>`
    productsStorage()    
}
//*LocalStorage
function productsStorage(){
    localStorage.setItem("car", JSON.stringify(carProducts))
}
//* Eliminar productos del carrito
function deleteProduct(event) {
    if( event.target.classList.contains('delete__product') ){
        const productId = event.target.getAttribute('data-id')
        carProducts = carProducts.filter(product => product.id != productId)
        carElementsHTML()
    }
}
//* Vaciar el carrito
function emptyCar() {
    carProducts = [];
    carElementsHTML();
}
//* Ventana Modal
//* 1. Crear función que escuche el botón del producto.
function modalProduct(event) {
    if(event.target.classList.contains("products__details")){
        modalContainer.classList.add("show__modal")
        const product = event.target.parentElement.parentElement
        modalDetailsElement(product)
    }
}
//* 2. Crear función que escuche el botón de cierre.
function closeModal(event) {
    if(event.target.classList.contains("modal__icon")){
        modalContainer.classList.remove("show__modal")
    }
}
//* 3. Crear función que convierta la info HTML en objeto.
function modalDetailsElement(product) {
    const infoDatails = {
        id: product.querySelector('button').getAttribute('data-id'),
        image: product.querySelector('img').src,
        name: product.querySelector('h3').textContent,
        price: product.querySelector('.products__div .products__price').textContent,
        description: product.querySelector('.products__details').getAttribute('data-description'),
        stock: product.querySelector('.products__details').getAttribute('data-quantity')

    }
    modalDetails = [ ...modalDetails, infoDatails ]
    modalHTML()
}
//* 4. Dibujar producto dentro del modal.
function modalHTML() {
    let detailsHTML = ""
    for( let element of modalDetails ) {
        detailsHTML = `
            <section class="modal__section">
                <div class="modal__section--div">
                    <h3 class="modal__section--h3">${element.name}</h3>
                    <p>${element.description}</p>
                    <h2 class="modal__section--h2">Precio/unidad: ${element.price}</h2>
                    <p class="modal__section--p"> Ropa oficial de Academlo* </p>                    
                </div>    
                <div class="modal__section--div">
                    <img src="${element.image}" class="modal__section--img">
                </div>    
            </section>
            <section>
                <div class="modal__button">
                    <button class="modal__section--button"> Añadir al carrito </button>
                </div> 
            </section>
        `
    }
    modalElement.innerHTML = detailsHTML
}
