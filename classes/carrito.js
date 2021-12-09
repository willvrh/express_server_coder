import fs from 'fs'
import Contenedor from './contenedor.js';


class Carrito {
    

    constructor(){
        this.filename = "./files/carrito.txt"
        this.data = []
        this.loadFromFile();
        this.container = new Contenedor();
    }

    save = async (object) => {
        this.loadFromFile();
        object.id = this.getNextId()
        object.timestamp = Date.now();
        this.data.push(object)
        
        try {
            this.saveToFile()
            return {status: "success", payload: object, cartID: object.id}
        } catch (e) {
            return {error: "no se pudo guardar el carrito"}
        }
    }

    addToCart = async (cartID,productID) => {
        const product = this.container.getById(productID);

        this.data.forEach(product => {
            if (product.id == object.id) {
                product.nombre = object.nombre
                product.precio = object.precio
                product.foto = object.foto
            }
        });
        try {
            this.saveToFile()
            return {status: "success", payload: object}
        } catch (e) {
            return {error: "no se pudo actualizar el producto"}
        }
        
        
    }

    getById = async (id) => {
        this.loadFromFile();
        let cart = this.data.find(element => element.id == id)
        return cart != undefined ? {status: "success", payload: cart} : {error: 'carrito no encontrado'}
    }

    getAll = async () => {
        this.loadFromFile();
        return this.data.length>0 ? {status: "success", payload: this.data} : {error: 'carritos no encontrados'}
    }

    deleteById = async (id) => {
        this.loadFromFile();
        let cart = this.data.find(element => element.id == id)
        if (cart != undefined) {
            this.data = this.data.filter(element => element.id != id)
            this.saveToFile()
            return {status: "success", payload: `El carrito ${id} fue eliminado`}
        } else {
            return {error: 'Carrito no encontrado'}
        }
    }

    deleteAll = async () => {
        this.loadFromFile();
        this.data = []
        this.saveToFile()
        return {status: "success", payload: `Los carritos fueron eliminados`}
    }

    saveToFile = async () => {
        try {
            await (fs.writeFileSync(this.filename, JSON.stringify(this.data)))
            return "ok"
        } catch (err) {
            return err
        }
    }

    loadFromFile = async () => {
        try {
            await (this.data = JSON.parse(fs.readFileSync(this.filename, "utf-8")))
            return "ok"
        } catch (err) {
            this.data = []
            this.saveToFile()
            return err
        }
    }

    getNextId = () => {
        this.loadFromFile();
        let lastId = 0
        this.data.forEach(element => {
            element.id>lastId ? lastId = element.id : false
        });
        return lastId+1
    }
}

export default Carrito;