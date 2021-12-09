import express from 'express'
import Carrito from '../classes/carrito.js'
import { io, administrador, __dirname } from '../app.js'

const router = express.Router()

const cart = new Carrito()

//GETS
//Admin & user
router.get('/:cartid/productos', function(req, res) {
    let id = parseInt(req.params.cartid)
    
    cart.getById(id).then(result=>{
        console.log("result", result)
        result.hasOwnProperty('error')? 
        res.send(result)
        :
        res.send({status: "success", payload: result.payload.products})
        
    })
})

//POSTS
//Admin & user
router.post('/', (req, res) => {
    let newCart = req.body
    cart.save(newCart).then((result)=> {
        res.send(result)
    })
})

router.post('/:cartid/productos', (req, res) => {
    let cartID = parseInt(req.params.cartid)
    let productsID = req.body.ids
    cart.addToCart(cartID, productsID).then((result)=> {
        res.send(result)
    })
})

//PUTS
//Only admin 
router.put('/:cartid/productos', (req, res) => {
    if (administrador) {
        let id = parseInt(req.params.cartid)
        let product = req.body
        product.id = id
        container.update(product).then((result)=> {
            container.getAll().then(res => {
                io.emit('products', res)
            })
            res.send(result)
        })
    } else {
        res.send({error: "auth_error", description: "Ruta / método POST no autorizado"})
    }
})

//DELETES
//Only admin 
router.delete('/:cartid', (req, res) => {
    let cartID = parseInt(req.params.cartid)
    cart.deleteById(cartID).then((result)=> {
        res.send(result)
    })
})

router.delete('/:cartid/productos/:productid', (req, res) => {
    let cartID = parseInt(req.params.cartid)
    let productID = parseInt(req.params.productid)
    cart.removeFromCart(cartID,productID).then((result)=> {
        res.send(result)
    })
})

export default router