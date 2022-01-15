import {database_mariadb as database} from "../config.js"
import faker from 'faker'


export default class Products{
    constructor(){
        database.schema.hasTable('products').then(result=>{
            if(!result){//No existe la tabla, hay que crearla
                database.schema.createTable('products',table=>{
                    table.increments();
                    table.string('title').notNullable();
                    table.string('thumbnail').notNullable();
                    table.double('price').notNullable();
                    table.timestamps(true,true);
                }).then(result=>{
                    console.log("products table created");
                })
            }
        })
    }

    save = async (product) =>{
        try{
            const requiredData = ["title", "price"]
            let validKeys = true;
            requiredData.forEach(key => { if(!Object.prototype.hasOwnProperty.call(product, key)) { validKeys = false } });
            if (!validKeys) { return {error: 'El producto debe contener los siguientes campos: '+requiredData.toString()}}
            
            let exists = await database.table('products').select().where('title',product.title).first();
            if(exists) return {status:"error",message:"El producto ya existe"}
            let result = await database.table('products').insert(product)
            return {status:"success",payload:`Producto registrado con id: ${result[0]}`}
        }catch(error){
            console.log(error);
            return {status:"error", message:error}
        }
    }

    update = async (product) =>{
        try{
            const requiredData = ["id", "title", "price"]
            let validKeys = true;
            requiredData.forEach(key => { if(!Object.prototype.hasOwnProperty.call(product, key)) { validKeys = false } });
            if (!validKeys) { return {error: 'El producto debe contener los siguientes campos: '+requiredData.toString()}}
            
            let exists = await database.table('products').select().where('title',product.title).first();
            if(!exists) return {status:"error",message:"El producto no existe"}


            
            let result = await database.table("products").update(product).where("id", product.id)
            return {status:"success",payload:`Producto actualizado: ${result[0]}`}
        }catch(error){
            console.log(error);
            return {status:"error", message:error}
        }
    }

    getFakeProducts = (qty) => {
        try{
            let products = []

            for (let i = 0; i < qty; i++) {
                products.push({
                    id: faker.datatype.uuid(),
                    title: faker.commerce.productName(),
                    thumbnail: faker.image.business(300, 300, true),
                    price: faker.commerce.price(100, 60000, 0, ''),
                    created_at: faker.date.recent(),
                    updated_at: faker.date.recent()
                })
            }
            return {status:"success",payload:products}
        }catch(error){
            return {status:"error",message:error}
        }
    }

    getAll = async () =>{
        try{
            let products = await database.select().table('products');
            return {status:"success",payload:products}
        }catch(error){
            return {status:"error",message:error}
        }
    }

    getByID = async (id) =>{
        try{
            let product = await database.select().table('productos').where('id',id).first();
            if(product){
                return {status:"success",payload:product}
            }else{
                return {status:"error",message:"Producto no encontrado"}
            }
        }catch(error){
            return {status:"error",message:error}
        }
    }

    deleteByID = async (id) =>{
        try{
            let product = await database.table('productos').where('id', id).del()
            if(product){
                return {status:"success",payload:"Producto eliminado"}
            }else{
                return {status:"error",message:"Producto no eliminado"}
            }
        }catch(error){
            return {status:"error",message:error}
        }
    }

}