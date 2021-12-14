import {database_sqlite as database} from "../config.js";

export default class Chat{
    constructor(){
        database.schema.hasTable('chat').then(result=>{
            if(!result){//No existe la tabla, hay que crearla
                database.schema.createTable('chat',table=>{
                    table.increments();
                    table.string('socket_id').notNullable();
                    table.string('email').notNullable();
                    table.string('message').notNullable();
                    table.timestamps(true,true);
                }).then(result=>{
                    console.log("chat table created");
                })
            }
        })
    }

    getMessages = async () =>{
        try{
            let messages = await database.select().table('chat');
            return {status:"success",payload:messages}
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