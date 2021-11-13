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
    console.log(product)
    container.save(product).then((result)=> {
        res.send(result)
    })
})



module.exports = router