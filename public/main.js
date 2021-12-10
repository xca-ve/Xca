
let newSW;
if ('serviceWorker' in  navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(result =>{
            result.addEventListener('updatefound', () => {
                newSW = result.installing;
                console.log('Hay un nuevo SW', newSW)

                newSW.addEventListener('statechange', () => {
                    if(newSW.state == "installed"){
                        showSnackbar();
                    }
                })
            })
        })
        
    })
}



//Snackbar-----
function showSnackbar() {
    // consigue el snackbar DIV
    let x = document.getElementById("snackbar");
  
    // Agregar la clase "show" a DIV
    x.className = "show";
  
}
//--------------------------------------------------------
let botonActualizar = document.getElementById('launchUpdate')

botonActualizar.addEventListener('click', () => {
    console.log('Hacer el skipwaiting');
    window.location.reload(); 
    newSW.postMessage({action: 'skipWaiting'})
})

fetch(api+'productos').then(response => response.json())
.then(data => {let container= document.getElementById('products');
let html=``;
 data.forEach(product => {
    
     html+=`<div class="carts">
    <div>
        <img src="./images/products/${product.image}" alt="">
        <p><span>${product.precio}</span>$</p>
    </div>
    <p class="title">${product.title}</p>
    <a href="" data-id="${product.id}" class="btn-add-cart">AÑADIR AL CARRITO</a>
</div>`;

 })
 container.innerHTML=html;
})











//Codigo de productos------------------------------------------------------------
//variables
let allContainerCart = document.querySelector('.products');
let containerBuyCart = document.querySelector('.card-items');
let priceTotal = document.querySelector('.price-total')
let amountProduct = document.querySelector('.count-product');
let btnaddPedido= document.getElementById('hacerPedido');

let buyThings = [];
let totalCard = 0;
let countProduct = 0;
navigator.serviceWorker.ready.then((swRegistration)=>{
    return swRegistration.sync.register('Sicoronizacion');
}).then(function (){
    console.log('Se registro la sincronización');
}) 
//functions
loadEventListenrs();
function loadEventListenrs(){
    allContainerCart.addEventListener('click', addProduct);

    containerBuyCart.addEventListener('click', deleteProduct);
    btnaddPedido.addEventListener('click',addpedido);   
}

function addProduct(e){
    e.preventDefault();
    if (e.target.classList.contains('btn-add-cart')) {
        const selectProduct = e.target.parentElement; 
        readTheContent(selectProduct);
    }
}

function deleteProduct(e) {
    if (e.target.classList.contains('delete-product')) {
        const deleteId = e.target.getAttribute('data-id');

        buyThings.forEach(value => {
            if (value.id == deleteId) {
                let priceReduce = parseFloat(value.price) * parseFloat(value.amount);
                totalCard =  totalCard - priceReduce;
                totalCard = totalCard.toFixed(2);
                
            }
        });
        buyThings = buyThings.filter(product => product.id !== deleteId);
        
        countProduct--;
        if(countProduct==0) {   
            totalCard=0;
         }
         if(totalCard==0) {

            removeproductoCarrito(deleteId);
        }else{
            updateproductoCantidadCarrito(deleteId,totalCard);
        }

    }
    loadHtml();
}

function readTheContent(product){
    const infoProduct = {
        image: product.querySelector('div img').src,
        title: product.querySelector('.title').textContent,
        price: product.querySelector('div p span').textContent,
        id: product.querySelector('a').getAttribute('data-id'),
        amount: 1
    }

    totalCard = parseFloat(totalCard) + parseFloat(infoProduct.price);
    totalCard = totalCard.toFixed(2);

    const exist = buyThings.some(product => product.id === infoProduct.id);
    if (exist) {
        const pro = buyThings.map(product => {
            if (product.id === infoProduct.id) {
                product.amount++;
                updateproductoCantidadCarrito(product.id, product.amount);
                return product;
            } else {
                return product
            }
        });
        buyThings = [...pro];
    } else {
        buyThings = [...buyThings, infoProduct]
        countProduct++;
        addproductoCarrito(infoProduct);
    }
    loadHtml();
    //console.log(infoProduct);
}

function loadHtml(){
    clearHtml();
    buyThings.forEach(product => {
        const {image, title, price, amount, id} = product;
        const row = document.createElement('div');
        row.classList.add('item');
        row.innerHTML = `
            <img src="${image}" alt="">
            <div class="item-content">
                <h5>${title}</h5>
                <h5 class="cart-price">${price}$</h5>
                <h6>Amount: ${amount}</h6>
            </div>
            <span class="delete-product" data-id="${id}">X</span>
        `;

        containerBuyCart.appendChild(row);

        priceTotal.innerHTML = totalCard;

        amountProduct.innerHTML = countProduct;
    });
}
 function clearHtml(){
    containerBuyCart.innerHTML = '';
 }




