import {database_mariadb as database} from "../config.js";

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

    getAll = async () =>{
        try{
            let products = await database.select().table('products');
            return {status:"success",payload:products}
        }catch(error){
            return {status:"error",message:error}
        }
    }

    getMessageByID = async (id) =>{
        try{
            let message = await database.select().table('chat').where('id',id).first();
            if(message){
                return {status:"success",payload:message}
            }else{
                return {status:"error",message:"Mensaje no encontrado"}
            }
        }catch(error){
            return {status:"error",message:error}
        }
    }

    saveMessage = async (message) =>{
        try{
            let result = await database.table('chat').insert(message)
            return {status:"success",payload:`Mensaje registrado con id: ${result[0]}`}
        }catch(error){
            console.log(error);
            return {status:"error", message:error}
        }
    }
}