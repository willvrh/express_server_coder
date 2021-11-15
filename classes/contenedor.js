const fs = require('fs')

class Contenedor {
    
    constructor(){
        this.filename = "./files/productos.txt"
        this.data = []
        this.loadFromFile();
        
    }

    save = async (object) => {
        this.loadFromFile();
        const requiredData = ["title", "price", "thumbnail"]
        let validKeys = true;
        requiredData.forEach(key => { if(!Object.prototype.hasOwnProperty.call(object, key)) { validKeys = false } });
        if (!validKeys) { return {error: 'El producto debe contener los siguientes campos: '+requiredData.toString()}}
        object.id = this.getNextId()
        this.data.push(object)
        this.saveAndReload()
        try {
            this.saveAndReload()
            return {status: "success", payload: object, productId: object.id}
        } catch (e) {
            return {error: "no se pudo guardar el producto"}
        }
    }

    update = async (object) => {
        const requiredData = ["title", "price", "thumbnail"]
        requiredData.forEach(key => {
            if (!object.hasOwnProperty(key)) {
                return {error: `el producto debe tener la propiedad ${key}`}
            }
        });
        this.data.forEach(product => {
            if (product.id == object.id) {
                product.title = object.title
                product.price = object.price
                product.thumbnail = object.thumbnail
            }
        });
        try {
            this.saveAndReload()
            return {status: "success", payload: object}
        } catch (e) {
            return {error: "no se pudo actualizar el producto"}
        }
        
        
    }

    getById = async (id) => {
        let product = this.data.find(element => element.id == id)
        return product != undefined ? {status: "success", payload: product} : {error: 'producto no encontrado'}
    }

    getRandomItem = async () => {
        let product = this.data[Math.floor(Math.random()*this.data.length)]
        return product != undefined ? {status: "success", payload: product} : {error: 'producto no encontrado'}
    }

    getAll = async () => {
        this.loadFromFile();
        return this.data.length>0 ? {status: "success", payload: this.data} : {error: 'productos no encontrados'}
    }

    deleteById = async (id) => {
        let product = this.data.find(element => element.id == id)
        if (product != undefined) {
            this.data = this.data.filter(element => element.id != id)
            this.saveAndReload()
            return {status: "success", payload: `El producto ${id} fue eliminado`}
        } else {
            return {error: 'producto no encontrado'}
        }
    }

    deleteAll = async () => {
        this.data = []
        this.saveAndReload()
        return {status: "success", payload: `Los productos fueron eliminados`}
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
            this.saveAndReload()
            return err
        }
    }

    saveAndReload() {
        this.saveToFile().then( this.loadFromFile() )
    }

    getNextId = () => {
        let lastId = 0
        this.data.forEach(element => {
            element.id>lastId ? lastId = element.id : false
        });
        return lastId+1
    }
}

module.exports = Contenedor;
