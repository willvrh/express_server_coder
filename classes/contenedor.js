const fs = require('fs')

class Contenedor {
    
    constructor(){
        this.filename = "./files/productos.txt"
        this.data = []
        this.loadFromFile();
        
    }

    save = async (object) => {
        const requiredData = ["title", "price", "thumbnail"]
        requiredData.forEach(key => {
            if (!object.hasOwnProperty(key)) {
                return {status: "error", payload: `El elemento debe contener el valor: ${key}`}
            }
        });
        object.id = this.getNextId()
        this.data.push(object)
        this.saveAndReload()
        return {status: "success", payload: object, productId: object.id}
    }

    getById = async (id) => {
        let product = this.data.find(element => element.id == id)
        return product != undefined ? {status: "success", payload: product} : {status: "error", payload: "Producto no encontrado"}
    }

    getRandomItem = async () => {
        let product = this.data[Math.floor(Math.random()*this.data.length)]
        return product != undefined ? {status: "success", payload: product} : {status: "error", payload: "Producto no encontrado"}
    }

    getAll = async () => {
        return this.data.length>0 ? {status: "success", payload: this.data} : {status: "error", payload: "No hay productos registrados"}
    }

    deleteById = async (id) => {
        let product = this.data.find(element => element.id == id)
        if (product != undefined) {
            this.data = this.data.filter(element => element.id != id)
            this.saveAndReload()
            return {status: "success", payload: `El producto ${id} fue eliminado`}
        } else {
            return {status: "error", payload: `Producto ${id} no encontrado`}
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
