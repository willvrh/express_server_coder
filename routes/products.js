const express = require('express')
const router = express.Router()
const Contenedor = require('../classes/contenedor.js')

const container = new Contenedor()


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
router.post('/', (req, res) => {
    let product = req.body
    container.save(product).then((result)=> {
        res.send(result)
    })
})

//PUTS
router.put('/:pid', (req, res) => {
    let id = parseInt(req.params.pid)
    let product = req.body
    product.id = id
    container.update(product).then((result)=> {
        res.send(result)
    })
})

//DELETES
router.delete('/:pid', (req, res) => {
    let id = parseInt(req.params.pid)
    container.deleteById(id).then((result)=> {
        res.send(result)
    })
})

module.exports = router