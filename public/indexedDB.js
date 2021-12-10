var db = new Dexie("Carrito");
var db2 = new Dexie("Pedido");
let api='https://pwa-tere.vercel.app/';

db.version(1).stores({
   
    Carrito:`id,
    image,
    precio,title,amount`   
  });
db2.version(1).stores({
   
    pedido:`id,
    image,
    precio,title,amount`,  
  });

function addproductoCarrito(producto) {
    db.transaction('rw', db.Carrito, () => {
    db.Carrito.bulkPut([producto]);
    });
}  

function removeproductoCarrito(id) {
    db.transaction('rw', db.Carrito, () => {
        db.Carrito.delete(id);
        });
}
function updateproductoCantidadCarrito(id,amount) {
    db.transaction('rw', db.Carrito, () => {
        db.Carrito.update(id,{"amount":amount})
  });
}

function addpedido() {
    db.transaction('rw', db.Carrito, () => {
 
        let pedidos = db.Carrito;
        console.log(pedidos);
        if(pedidos!= undefined){
         pedidos.each((element)=>{
            db2.transaction('rw', db2.pedido, () => {

                db2.pedido.bulkPut([element]);
                sendPedido(element);
                });
        })
       }});

}

function sendPedido(element) {
    fetch(api+'pedido/guardaPedido', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors,   *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(element) // body data type must match "Content-Type" header
      })
      .then(data => {
      alert("Tu pedido ha sido enviado");
      
      })
      .catch(function(err) {
        db2.pedido.bulkPut([element]);
       alert("Tu pedido se registro offline se sincronizara cuando estes de nuevo en linea")
      })
}

function sincronizar() {
    db2.transaction('rw', db2.pedido, () => {
 
        let pedidos = db2.pedido;
        console.log(pedidos);
        if(pedidos!= undefined){
         pedidos.each((element)=>{
            sendPedido(element);
            db2.pedido.delete(element.id);
        })
       }});

}
