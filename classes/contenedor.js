import fs from 'fs'

class Contenedor {
    
    constructor(){
        this.filename = "./files/productos.txt"
        this.data = []
        this.loadFromFile();
        
    }

    save = async (object) => {
        this.loadFromFile();
        const requiredData = ["nombre", "precio", "descripcion", "codigo"]
        let validKeys = true;
        requiredData.forEach(key => { if(!Object.prototype.hasOwnProperty.call(object, key)) { validKeys = false } });
        if (!validKeys) { return {status: "failed", error: "missing_fields", description: 'El producto debe contener los siguientes campos: '+requiredData.toString()}}
        object.id = this.getNextId()
        object.timestamp = Date.now()

        //Checks for existing code
        let productoExiste = this.getByCode(object.codigo);
        if (productoExiste.status == "success") return {status: "failed", error: "existing_code", description: `El código ${object.codigo} ya se encuentra registrado`}

        this.data.push(object)
        try {
            this.saveToFile()
            return {status: "success", payload: object, productId: object.id}
        } catch (e) {
            return {status: "failed", error: "cant_save", error: "No se pudo guardar el producto"}
        }
    }

    update = async (object) => {
        const requiredData = ["nombre", "precio", "descripcion"]
        requiredData.forEach(key => {
            if (!object.hasOwnProperty(key)) {
                return {status: "failed", error: "missing_field", description: `El producto debe tener la propiedad ${key}`}
            }
        });
        this.data.forEach(product => {
            if (product.id == object.id) {
                product.nombre = object.nombre
                product.precio = object.precio
                product.descripcion = object.descripcion
                product.codigo = object.codigo
                product.foto = object.foto
            }
        });
        try {
            this.saveToFile()
            return {status: "success", payload: object}
        } catch (e) {
            return {status: "failed", error: "cant_save", description: "No se pudo actualizar el producto"}
        }
        
        
    }

    getById = async (id) => {
        let product = this.data.find(element => element.id == id)
        return product != undefined ? {status: "success", payload: product} : {status: "failed", error: 'not_found', description: 'Producto no encontrado'}
    }

    getByCode = (code) => {
        let product = this.data.find(element => element.codigo == code)
        return product != undefined ? {status: "success", payload: product} : {status: "failed", error: 'not_found', description: 'Producto no encontrado'}
    }

    getByIds = (ids) => {
        let products = []
        ids.forEach(id => {
            let productAdd = this.data.find(element => element.id == id)
            productAdd !== undefined ? products.push(productAdd) : true
        });
        
        return {status: "success", payload: products}
    }

    getRandomItem = async () => {
        let product = this.data[Math.floor(Math.random()*this.data.length)]
        return product != undefined ? {status: "success", payload: product} : {status: "failed", error: 'producto no encontrado'}
    }

    getAll = async () => {
        this.loadFromFile();
        return this.data.length>0 ? {status: "success", payload: this.data} : {status: "failed", error: 'productos no encontrados'}
    }

    deleteById = async (id) => {
        let product = this.data.find(element => element.id == id)
        if (product != undefined) {
            this.data = this.data.filter(element => element.id != id)
            this.saveToFile()
            return {status: "success", payload: `El producto ${id} fue eliminado`}
        } else {
            return {status: "failed", error: "not_found", description: 'producto no encontrado'}
        }
    }

    deleteAll = async () => {
        this.data = []
        this.saveToFile()
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
            this.saveToFile()
            return err
        }
    }

    getNextId = () => {
        let lastId = 0
        this.data.forEach(element => {
            element.id>lastId ? lastId = element.id : false
        });
        return lastId+1
    }
}

export default Contenedor;