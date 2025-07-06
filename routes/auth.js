import { Router } from "express"
import { getAuthUser, login, logout, register } from "../db/users/operations.js"
import { EmailAlreadyExistsError, IncompleteCredentialsError, InternalServerError, InvalidCredentialsError, NoRefreshTokenError } from "../db/errors.js"
import { verifyFirebaseToken } from "../middleware.js"
import { config } from "../config/env.js"
import { loginValidation, registerValidation } from "../config/req-validation.js"

export const authRouter = Router()

//user login with validation middleware
authRouter.post('/login', loginValidation, async (req,res)=>{
    try{
        // Use validated data from middleware
        const { email, password } = req.validatedData;
        console.log(req.body)
        const {idToken, refreshToken, uid, name} = await login(email,password)

        console.log(idToken)
        //save tokens to cookies
          if (idToken) {
              
              res.cookie('access_token', idToken, {
                  httpOnly: true,
                  path: '/',
                  maxAge: 60 * 60 * 1000,
                  ...(config.NODE_ENV === 'production' && {
                      secure: true,
                      sameSite: 'None'
                  }),
                  ...(config.NODE_ENV !== 'production' && {
                      sameSite: 'Lax'
                  })
              });
              res.cookie('refresh_token', refreshToken, {
                  httpOnly: true,
                  path: '/',
                  maxAge: 14 * 24 * 60 * 60 * 1000,
                  ...(config.NODE_ENV === 'production' && {
                      secure: true,
                      sameSite: 'None'
                  }),
                  ...(config.NODE_ENV !== 'production' && {
                      sameSite: 'Lax'
                  })
              });
              res.status(200).json({ message: "User logged in successfully", result: {uid,email, name} });
          }     
      }catch(error){
        if (error instanceof IncompleteCredentialsError){
            return res.status(422).json({
                email: "Email is required",
                password: "Password is required",
            });
        }else if (error instanceof InternalServerError){
            return res.status(500).json({error:"Internal Server Error"})
        }else if (error instanceof InvalidCredentialsError){
            return res.status(401).json({error:"Invalid Credentials"})
        }
      }   
})

//register user with validation
authRouter.post('/register', registerValidation, async (req,res)=>{
    try{
        // Use validated data from middleware
        const { email, password, name } = req.validatedData;
        console.log(req.body)
        const {idToken, refreshToken, userCred} = await register(email,password,name)

        console.log(idToken)
        //save tokens to cookies
          if (idToken) {
              res.cookie('access_token', idToken, {
                  httpOnly: true,
                  path: '/',
                  maxAge: 60 * 60 * 1000,
                  ...(config.NODE_ENV === 'production' && {
                      secure: true,
                      sameSite: 'None'
                  }),
                  ...(config.NODE_ENV !== 'production' && {
                      sameSite: 'Lax'
                  })
              });
              res.cookie('refresh_token', refreshToken, {
                  httpOnly: true,
                  path: '/',
                  maxAge: 14 * 24 * 60 * 60 * 1000,
                  ...(config.NODE_ENV === 'production' && {
                      secure: true,
                      sameSite: 'None'
                  }),
                  ...(config.NODE_ENV !== 'production' && {
                      sameSite: 'Lax'
                  })
              });
              res.status(200).json({ message: "User created successfully", result:{uid: userCred.user.uid} });
          }     
      }catch(error){
        if (error instanceof IncompleteCredentialsError){
            return res.status(422).json({
                email: "Email is required",
                password: "Password is required",
            });
        }else if (error instanceof InternalServerError){
            return res.status(500).json({error:"Internal Server Error"})
        }else if (error instanceof InvalidCredentialsError){
            return res.status(401).json({error:"Invalid Credentials"})
        }else if (error instanceof EmailAlreadyExistsError){
            return res.status(401).json({error:"Email Already Exists"})
        }
      }   
})


//logout user
authRouter.post("/logout", verifyFirebaseToken, (req,res)=>{ 

    logout().then(() => {
    //clear the tokens from cookies
    res.clearCookie('access_token', {
        httpOnly: true,
        path: '/',
        ...(config.NODE_ENV === 'production' && {
            secure: true,
            sameSite: 'None'
        }),
        ...(config.NODE_ENV !== 'production' && {
            sameSite: 'Lax'
        })
    });
    res.clearCookie('refresh_token', {
        httpOnly: true,
        path: '/',
        ...(config.NODE_ENV === 'production' && {
            secure: true,
            sameSite: 'None'
        }),
        ...(config.NODE_ENV !== 'production' && {
            sameSite: 'Lax'
        })
    });
    res.status(200).json({ result: "User logged out successfully" });
    })
    .catch((error) => {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
    });
})

//endpoint that is fired everytime a user visits a page to check validity of tokens, if not user as to login again
//this is done so that user is checked for authorization on every action he does
authRouter.get('/me', verifyFirebaseToken, async (req, res) => {
    try{
       const user = await getAuthUser(req.user.uid);
   
     return res.status(200).json({result:{
       uid: user.uid,
       email: user.email,
     }});
    }catch(e){
       if(e instanceof NoRefreshTokenError){
          return res.status(401).json({error:"No Refresh Token"})
       }
       return res.status(401).json({error:"Server Error"})
    }
     
 })