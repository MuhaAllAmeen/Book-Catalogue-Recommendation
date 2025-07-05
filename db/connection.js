import mysql from 'mysql'
import dotenv from "dotenv"
dotenv.config({ path: '.env.local' })

//connect to mysql db
export function connectToDatabase(){
    try{
        const connection = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
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