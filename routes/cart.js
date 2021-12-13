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
    console.log(newCart);
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