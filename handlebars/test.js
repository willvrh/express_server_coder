const Contenedor = require('./contenedor.js')

const container = new Contenedor("productos.txt")

//deleteAll / getAll test
container.deleteAll()
console.log("BORRA TODO")
console.log(container.getAll())

//save test
let newProduct = {
    title: "Escuadra",
    price: 123.45,
    thumbnail: "https://http2.mlstatic.com/D_NQ_NP_2X_756731-MLA41838499132_052020-F.webp"
}
let newProduct2 = {
    title: "Calculadora",
    price: 234.56,
    thumbnail: "https://pardohogar.vtexassets.com/arquivos/ids/159598/CLACU-01.jpg"
}
let newProduct3 = {
    title: "Globo Terráqueo",
    price: 456.78,
    thumbnail: "https://cdn.shopify.com/s/files/1/1086/1234/products/257W_opt_1024x1024.jpg"
}
console.log("ID NUEVO PRODUCTO: "+container.save(newProduct))
console.log("ID NUEVO PRODUCTO: "+container.save(newProduct2))
console.log("ID NUEVO PRODUCTO: "+container.save(newProduct3))
console.log("CONTENEDOR CON 3 PRODUCTOS")
console.log(container.getAll())
