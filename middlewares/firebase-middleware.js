import { getAuth } from 'firebase-admin/auth';
import axios from 'axios'
import { NoAccessTokenError, NoRefreshTokenError } from '../utils/errors.js';
import { config } from '../utils/env.js';

export const verifyFirebaseToken = async (req, res, next) => {

  try {
    //retrieve access token from cookie and verify it
    let token = req.cookies.access_token
    
    if (!token) {
      throw new NoAccessTokenError()
    }else{
      const decoded = await getAuth().verifyIdToken(token);
      //if verified the user is sent with the request to the endpoint
      req.user = decoded;
      return next();
    }
    
  } catch (err) {
    
    console.error(err)
    if (err instanceof NoAccessTokenError){
        //if no access token but refresh token is present then we can get new token instead of logging out the user and loggin back
      const refreshToken = req.cookies.refresh_token;
    //   console.log(refreshToken)
      
        //if refresh token has expired, force the user to login
      if (!refreshToken) return res.status(401).json({ error: 'Please Login' });

      try {
        const refreshRes = await axios.post(
          `https://securetoken.googleapis.com/v1/token?key=${config.FIREBASE_API_KEY}`,
          new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
          })
        );

        const newIdToken = refreshRes.data.id_token;
        const newRefreshToken = refreshRes.data.refresh_token;
        // console.log(`new access token ${newIdToken}`)

        // Set new cookies
        res.cookie('access_token', newIdToken, {
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
        res.cookie('refresh_token', newRefreshToken, {
          httpOnly: true,
          path: '/',
          maxAge: 60 * 60 * 24 * 14 * 1000,
          ...(config.NODE_ENV === 'production' && {
              secure: true,
              sameSite: 'None'
          }),
          ...(config.NODE_ENV !== 'production' && {
              sameSite: 'Lax'
          })
        });
        
        // the new token is verified again so that we can get user data from it and send to the endpoint
        const decoded = await getAuth().verifyIdToken(newIdToken);
        req.user = decoded;
        return next();
      } catch (e) {
        console.error(e)
        return res.status(401).json({ error: 'Session expired' });
      }
    }
    
  }
};