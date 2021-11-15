//Imports
const express = require('express')
const cors = require('cors')
const upload = require('./services/upload')

//Initialization
const app = express()
const port = process.env.PORT||8080
const productsRouter = require('./routes/products')

//Config

//app.use(upload.single('image'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(express.static('public'))
app.use(express.static('images'))

//Server
const server = app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`)
})

server.on('error', error => console.log(`Error en el servidor: ${error}`))

//Routes
app.use('/api/productos', productsRouter)