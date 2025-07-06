// Import config first to ensure environment variables are loaded
import './config/env.js'

import express from 'express'
import {booksRouter} from './routes/books.js'
import { connectToDatabase } from './db/connection.js'
import cors from 'cors'
import { firebaseAdminApp, firebaseApp } from './firebase.js'
import { authRouter } from './routes/auth.js'
import { userRouter } from './routes/user.js'
import cookieParser from 'cookie-parser'

//export the sql connection for use in our endpoints
export const connection = connectToDatabase()

const app = express()
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the allowed methods
    credentials: true // Allow credentials (if needed)
}));

app.use(express.json());
app.use(cookieParser());
app.use('/books',booksRouter)
app.use('/auth',authRouter)
app.use('/user',userRouter)



app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});