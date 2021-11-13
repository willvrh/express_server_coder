//Imports
const express = require('express')

//Initialization
const app = express()
const port = process.env.PORT||8080
const productsRouter = require('./routes/products')

//Config
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Server
const server = app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`)
})

server.on('error', error => console.log(`Error en el servidor: ${error}`))

//Routes
app.use('/api/productos', productsRouter)


