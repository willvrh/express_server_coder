//Imports
const express = require('express')
const cors = require('cors')
const multer = require('multer')

//Initialization
const app = express()
const port = process.env.PORT||8080
const productsRouter = require('./routes/products')
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now()+file.originalname)
    }
})
const upload = multer({storage: storage})

//Config
app.use(upload.single('file'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(express.static('public'))


//Server
const server = app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`)
})

server.on('error', error => console.log(`Error en el servidor: ${error}`))

//Routes
app.use('/api/productos', productsRouter)


