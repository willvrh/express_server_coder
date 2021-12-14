import knex from 'knex';
import __dirname from './utils.js';

const database_sqlite = knex({
    client:'sqlite3',
    connection:{filename:__dirname+'/ecommerce/chat.sqlite'}
})

const database_mariadb = knex({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'root',
      password : '',
      database : 'ecommerce'
    }
});

export {database_sqlite, database_mariadb}