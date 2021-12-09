import express from 'express'
import Carrito from '../classes/carrito.js'
import io from '../app.js'
import administrador from '../app.js'
import __dirname from '../app.js'

const router = express.Router()

const cart = new Carrito()

//GETS
//Admin & user
router.get('/:cartid/productos', function(req, res) {
    let id = parseInt(req.params.cartid)
    cart.getById(id).then(result=>{
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
    let productsID = req.body
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
router.delete('/:pid', (req, res) => {
    if (administrador) {
        let id = parseInt(req.params.pid)
        container.deleteById(id).then((result)=> {
            container.getAll().then(res => {
                io.emit('products', res)
            })
            res.send(result)
        })
    } else {
        res.send({error: "auth_error", description: "Ruta / método POST no autorizado"})
    }
})

export default router