import fs from 'fs'
import Contenedor from './contenedor.js';


class Carrito {
    

    constructor(){
        this.filename = "./files/carrito.txt"
        this.data = []
        this.loadFromFile();
        this.container = new Contenedor();
    }

    save = async (requestObject) => {
        this.loadFromFile();
        let newCart = {}
        newCart.id = this.getNextId()
        newCart.timestamp = Date.now();
        newCart.products = []
        this.data.push(newCart)
        
        try {
            this.saveToFile()
            return {status: "success", payload: newCart, cartID: newCart.id}
        } catch (e) {
            return {status: "failed", error: "save_error", description: e}
        }
    }

    addToCart = async (cartID,productsID) => {
        console.log("productsID",productsID)
        if (!Array.isArray(productsID)) {
            return {status: "failed", error: "empty_array" , description: "No se envió ningún producto"}
        } else {
            if (productsID.length==0) {
                return {status: "failed", error: "empty_array" , description: "No se envió ningún producto"}
            }
        }

        let cart = this.data.find(element => element.id == cartID)
        let prods = this.container.getByIds(productsID)
        console.log("prods", prods)
        prods.payload.forEach((product) => {
            
            let aux = cart.products.find(element => element.id == product.id)
            
            if (aux === undefined) {
                product.cantidad = 1
                cart.products.push(product)
            } else {
                aux.cantidad += 1
            }
            
        })
        
        try {
            this.saveToFile()
            return {status: "success", payload: cart}
        } catch (e) {
            return {status: "failed", error: "not_updated" , description: "No se actualizó el carrito"}
        }
        
    }

    removeFromCart = async (cartID,productID) => {
        
        if (productID === undefined) {
            return {status: "failed", error: "empty_id" , description: "No se envió ningún id"}
        }

        let cart = this.data.find(element => element.id == cartID)
        cart.products = cart.products.filter(product => product.id!=productID);
        
        try {
            this.saveToFile()
            return {status: "success", payload: cart}
        } catch (e) {
            return {status: "failed", error: "not_updated" , description: "No se actualizó el carrito"}
        }
        
    }

    getById = async (id) => {
        this.loadFromFile();
        let cart = this.data.find(element => element.id == id)
        return cart != undefined ? {status: "success", payload: cart} : {error: 'not_found', description: 'Carrito no encontrado'}
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
            return {status: "failed", error: "not_found", description: 'Carrito no encontrado'}
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