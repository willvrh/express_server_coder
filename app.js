//Imports
import express from 'express'
import cors from 'cors'
import {engine} from 'express-handlebars';
import upload from './services/upload.js'
import productsRouter from './routes/products.js'
import Contenedor from './classes/contenedor.js'
import Chat from './classes/chat.js'
import {Server} from 'socket.io'
import { dirname } from 'path';
import { fileURLToPath } from 'url';



//Initialization
const app = express()
const port = process.env.PORT||8080
const container = new Contenedor()
const chat = new Chat()
const __dirname = dirname(fileURLToPath(import.meta.url));

app.engine('handlebars',engine())
app.set('views','./views')
app.set('view engine','handlebars')

//Config

//app.use(upload.single('image'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(express.static(__dirname+'/public'))
app.use(express.static(__dirname+'/images'))


//Server
const server = app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`)
})

server.on('error', error => console.log(`Error en el servidor: ${error}`))

//Socket io initialization
const io = new Server(server)

let messages = []

io.on('connection', socket => {
    console.log("Cliente conectado")

    //Load all products on connect
    container.getAll().then(res => {
        socket.emit('products', res)
    })

    //Load all messages on connect
    chat.getAll().then(res => {
        socket.emit('messagelog', res.payload)
    })

    //Send new message to all sockets
    socket.on('message', data => {
        chat.save({socketID:socket.id, ...data})
        chat.getAll().then(res => {
            io.emit('messagelog', res.payload)
        })
    })
    
})


app.get('/api/productos',(req,res)=>{
    container.getAll().then(result=>{
        let data = result.payload;
        let preparedObject ={
            products : data
        }
        res.render('products',preparedObject)
    })
})


//Routes
app.use('/api/productos', productsRouter)

export default io