import { useAuth } from "@/context/auth_context";
import { Navigate } from "react-router";

// protected routes so that all pages under this if not logged in will redirect to login page
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {user} = useAuth()
    if (user == null){
        return <Navigate to={"/login"} />
    }
    return (
        <>
            {children}
        </>
    );
};

export default ProtectedRoute