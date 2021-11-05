const fs = require('fs')

class Contenedor {
    
    constructor(filename){
        this.filename = filename
        this.data = []
        this.loadFromFile();
    }

    save = (object) => {
        const requiredData = ["title", "price", "thumbnail"]
        requiredData.forEach(key => {
            if (!object.hasOwnProperty(key)) {
                throw new Error(`El elemento debe contener el valor: ${key} `)
            }
        });
        object.id = this.getNextId()
        this.data.push(object)
        this.saveAndReload()
        return object.id
    }

    getById = (id) => {
        return this.data.find(element => element.id == id)
    }

    getRandomItem = () => {
        return this.data[Math.floor(Math.random()*this.data.length)]
    }

    getAll = () => {
        return this.data
    }

    deleteById = (id) => {
        this.data = this.data.filter(element => element.id != id)
        this.saveAndReload()
    }

    deleteAll = () => {
        this.data = []
        this.saveAndReload()
    }

    saveToFile = async () => {
        try {
            await (fs.writeFileSync(this.filename, JSON.stringify(this.data)))
        } catch (err) {
            throw new Error(`Write error: ${err}`)
        }
    }

    loadFromFile = async () => {
        try {
            await (this.data = JSON.parse(fs.readFileSync(this.filename, "utf-8")))
        } catch (err) {
            this.data = []
            this.saveAndReload()
        }
    }

    saveAndReload() {
        this.saveToFile()
        this.loadFromFile()
    }

    getNextId() {
        let lastId = 0
        this.data.forEach(element => {
            element.id>lastId ? lastId = element.id : false
        });
        return lastId+1
    }
}

module.exports = Contenedor;

//const db = new Contenedor("productos.txt")