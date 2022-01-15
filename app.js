//Imports
import express from 'express'
import __dirname from './utils.js';
import cors from 'cors'
import {engine} from 'express-handlebars';
import upload from './services/upload.js'
import productsRouter from './routes/products.js'
import Products from './services/products.js';
import {Server} from 'socket.io'

import Chat from './services/chat.js';


//Initialization
const app = express()
const port = process.env.PORT||8080
const container = new Products()
const chat = new Chat()

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
    chat.getMessagesNormalized().then(res => {
        socket.emit('messagelog', res)
    })

    //Send new message to all sockets
    socket.on('message', data => {
        chat.saveMessage({socket_id:socket.id, ...data})
        
        chat.getMessagesNormalized().then(res => {
            io.emit('messagelog', res)
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

app.get('/api/productos-test',(req,res)=>{
    let data = container.getFakeProducts(5).payload;
    let preparedObject ={
        products : data
    }
    res.render('products',preparedObject)
})

//Routes
app.use('/api/productos', productsRouter)

export default io