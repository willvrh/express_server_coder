import express from 'express'
import upload from '../services/upload.js'
import Products from '../services/products.js'
import io from '../app.js'
const router = express.Router()
const container = new Products()


//GETS
router.get('/', function(req, res) {
    container.getAll().then(result=>{
        res.send(result)
    })
})

router.get('/:pid', function(req, res) {
    let id = parseInt(req.params.pid)
    container.getById(id).then(result=>{
        res.send(result)
    })
})

//POSTS
router.post('/', upload.single('image'), (req, res) => {
    try {
        let product = req.body
        let thumbnail = 'http://localhost:8080/'+req.file.filename
        product.thumbnail = thumbnail
        container.save(product).then((result)=> {
            container.getAll().then(res => {
                io.emit('products', res)
            })
            res.send(result)
        })
    } catch (e) {
        res.send("Error al subir archivo -> "+e)
    }
    
})

//PUTS
router.put('/:pid', (req, res) => {
    let id = parseInt(req.params.pid)
    let product = req.body
    product.id = id
    container.update(product).then((result)=> {
        container.getAll().then(res => {
            io.emit('products', res)
        })
        res.send(result)
    })
})

//DELETES
router.delete('/:pid', (req, res) => {
    let id = parseInt(req.params.pid)
    container.deleteById(id).then((result)=> {
        container.getAll().then(res => {
            io.emit('products', res)
        })
        res.send(result)
    })
})

export default router