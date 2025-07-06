// import { responseHandler } from '@/lib/utils';
import { UserModel } from '@/models/UserModel';
import { verifyToken } from '@/request/auth';
import { createContext, useState, useContext, useEffect } from 'react';

interface AuthContextType {
  user: UserModel | null;
  login: (user: UserModel) => void;
  logout: () => void;
}

//auth context to manage auth state across the app 
const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    // on every refresh or page change it will check the local storage if user is present
    const [user, setUser] = useState<UserModel | null>(() => {
      const stored = localStorage.getItem('user');
      return stored ? UserModel.fromObj(JSON.parse(stored)) : null;
    });
  
    //on login store user in localstorage
    const login = (user: UserModel) => {
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    };
    
    //clear user from local storage
    const logout = () => {
      setUser(null);
      localStorage.removeItem('user');
    };
  
    //keep user in sync if localStorage changes in another tab
    // I could fetch user details everytime and save it on every call
    // but since we are anyways saving user details in a persistent local storage we can reduce fetch operations
    useEffect(() => {
        verifyToken().then((res)=>{
            // I dont have to call syncUser here since the user is set on every refresh by its useState. 
            // Unless the user details change (like email or uid), the local storage is reliable
            // calling syncUser here would ensure always updated user data
            if (!res.ok){
                logout()
            }
        })
        // responseHandler(()=>verifyToken(),(result)=>{
            // console.log(result)
        // },()=>{
            // logout()
        // })

        //keep user in sync if localStorage changes in another tab
        //if user has two tabs open and logs in one tab, then he wil be logged in the other one too
      const syncUser = () => {
        console.log("sync")
        const stored = localStorage.getItem('user');
        setUser(stored ? UserModel.fromObj(JSON.parse(stored)) : null);
      };
      window.addEventListener('storage', syncUser);
      return () => window.removeEventListener('storage', syncUser);
    }, []);
  
    
    return (
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };

  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };