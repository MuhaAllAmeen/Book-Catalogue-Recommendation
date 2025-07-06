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
import rateLimit from 'express-rate-limit'

//export the sql connection for use in our endpoints
export const connection = connectToDatabase()

const app = express()
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000',"https://zippy-churros-517ebe.netlify.app"], // Allow requests from these origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the allowed methods
    credentials: true // Allow credentials (if needed)
}));

// Set up rate limiter: maximum of 100 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: "Too many requests from this IP, please try again after 15 minutes",
  });
  
// Apply the rate limiter to all requests
app.use(limiter);
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