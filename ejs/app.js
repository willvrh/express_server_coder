//Imports
import express from 'express'
import cors from 'cors'
import upload from './services/upload.js'
import productsRouter from './routes/products.js'
import Contenedor from './classes/contenedor.js'



//Initialization
const app = express()
const port = process.env.PORT||8080
const container = new Contenedor()

app.set('view engine','ejs')

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

app.get('/api/productos',(req,res)=>{
    container.getAll().then(result=>{
        let data = result.payload;
        let preparedObject ={
            products : data
        }
        res.render('productos.ejs',preparedObject)
    })
})


//Routes
app.use('/api/productos', productsRouter)