import mysql from 'mysql'
import { config } from '../config/env.js'

//connect to mysql db
export function connectToDatabase(){
    try{
        const connection = mysql.createPool({
            host: config.DB_HOST,
            user: config.DB_USER,
            password: config.DB_PASSWORD,
            database: config.DB_DATABASE
        })
        // connection.connect((err)=>{
        //     if (err) {
        //         console.error('Error connecting to MySQL: ' + err.stack);
        //         return;
        //     }
        //     console.log('Connected to MySQL as id ' + connection.threadId);
        // })
        return connection
    }catch(error){
        console.error('Error connecting to MySQL: ' + error.stack);
        return;
    }
    
}