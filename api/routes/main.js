const express = require('express');
var bodyParser = require('body-parser')
const router = express.Router();


var urlencodedParser = bodyParser.urlencoded({ extended: true });

var productos=[
  {
      "id":1,
      "image":"casco1.png",
      "precio":2800,
      "title":"Abatible Kov Stealth Alebrije Azul Dot"
  },
  {
      "id":2,
      "image":"casco2.png",
      "precio":2400,
      "title":"DEPREDATOR Casco Negro"
  },
  {
      "id":3,
      "image":"casco3.png",
      "precio":2600,
      "title":"Conejo diabolico Blanco"
  },
  {
      "id":4,
      "image":"casco4.png",
      "precio":2300,
      "title":"TTJZ CASCO DE LA MOTOCICLETA OREJAS"
  },
  {
      "id":5,
      "image":"casco5.png",
      "precio":1700,
      "title":"UIGJIOG CASCO rojo-azul"
  },
  {
      "id":6,
      "image":"casco6.png",
      "precio":1650,
      "title":"ONEAL 2SRS HELMET Verde- Azul"
  },
  {
      "id":7,
      "image":"casco7.png",
      "precio":1349,
      "title":"ONEAL 2SRS HELMET Morado-Blanco"
  },
  {
      "id":8,
      "image":"casco8.png",
      "precio":1650,
      "title":"ONEAL 2SRS HELMET Azul-blanco"
  },
  {
      "id":9,
      "image":"casco9.png",
      "precio":1800,
      "title":"Casco Shark Street Drak"
  },
  {
      "id":10,
      "image":"casco10.png",
      "precio":1700,
      "title":"BULLITT ROLAND SANDS VIVA"
  },
  {
      "id":11,
      "image":"casco11.png",
      "precio":1900,
      "title":"Bell Bullitt Carbon"
  },
  {
      "id":12,
      "image":"casco12.png",
      "precio":2900,
      "title":"BEON-Casco de 3/4"
  }

];
var pedidos =[];

router.get('/productos/', (req, res) => {
    res.json(productos);
});
router.get('/pedido/', (req, res) => {
  res.status(200).json(pedidos);
});


router.post('/pedido/guardaPedido', urlencodedParser, (req, res) => {

  pedidos.push(req.body);
  res.status(201).send("REgistro creado")
  });



module.exports = router;
