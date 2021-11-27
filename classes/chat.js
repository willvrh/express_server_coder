import fs from 'fs'

class Chat {
    
    constructor(){
        this.filename = "./files/chat.txt"
        this.data = []
        this.loadFromFile();
        
    }

    save = async (object) => {
        this.loadFromFile();
        const requiredData = ["email", "message"]
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
            return {error: "no se pudo guardar el mensaje"}
        }
    }

    getAll = async () => {
        this.loadFromFile();
        return this.data.length>0 ? {status: "success", payload: this.data} : {error: 'mensajes no encontrados'}
    }

    deleteAll = async () => {
        this.data = []
        this.saveAndReload()
        return {status: "success", payload: `Los mensajes fueron eliminados`}
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

export default Chat;