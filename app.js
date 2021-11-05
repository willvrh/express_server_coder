//Imports
const express = require('express')
const Contenedor = require('./contenedor.js')

//Initialization
const dataFile = "productos.txt"
const container = new Contenedor(dataFile)
const app = express()
const port = 8080

//Server
const server = app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port} usando ${dataFile} como base de datos`)
})

server.on('error', error => console.log(`Error en el servidor: ${error}`))

//Routes
app.get('/productos', function(req, res, next) {
    res.send(container.getAll())
})

app.get('/productoRandom', function(req, res, next) {
    res.send(container.getRandomItem())
})

