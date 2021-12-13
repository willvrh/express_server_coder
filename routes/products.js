import express from 'express'
import upload from '../services/upload.js'
import Contenedor from '../classes/contenedor.js'
import { io, administrador, port, __dirname } from '../app.js'
import fs from 'fs'

const router = express.Router()
const container = new Contenedor()


//GETS
//Admin & user
router.get('/', function(req, res) {
    container.getAll().then(result=>{
        res.send(result)
    })
})

//Admin & user
router.get('/:pid', function(req, res) {
    let id = parseInt(req.params.pid)
    container.getById(id).then(result=>{
        res.send(result)
    })
})

//POSTS
//Only admin 
router.post('/', upload.single('foto'), (req, res) => {
    if (administrador) {
        try {
            let product = req.body
            let foto = __dirname+"\\images\\"+req.file.filename
            product.foto = foto
            container.save(product).then((result)=> {
                //Delete image file if failed
                if (result.status == "failed") try { fs.unlinkSync(foto) } catch(err) { console.error(err) }
                
                container.getAll().then(res => {
                    io.emit('products', res)
                })
                res.send(result)
            })
        } catch (e) {
            res.send("Error al subir archivo -> "+e)
        }
    } else {
        res.send({error: "auth_error", description: `Ruta ${req.baseUrl} método ${req.method} no autorizado`})
    }
    
    
})

//PUTS
//Only admin 
router.put('/:pid', (req, res) => {
    if (administrador) {
        let id = parseInt(req.params.pid)
        let product = req.body
        product.id = id
        container.update(product).then((result)=> {
            container.getAll().then(res => {
                io.emit('products', res)
            })
            res.send(result)
        })
    } else {
        res.send({error: "auth_error", description: `Ruta ${req.baseUrl} método ${req.method} no autorizado`})
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
        res.send({error: "auth_error", description: `Ruta ${req.baseUrl} método ${req.method} no autorizado`})
    }
})

export default router