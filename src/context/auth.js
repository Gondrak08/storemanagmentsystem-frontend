
import { createContext, useState, useRef } from "react";


export const AuthContext = createContext({});


export const AuthProvider = ({ children }) => {
    const[authToken, setAuthToken] = useState(null)
    const[user, setUser] = useState(false);
    const[userEmail, setUserEmail] = useState(null);
    const[userPass, setUserPass] = useState(null);
    const[role, setRole] = useState(null);

    return (
        <AuthContext.Provider value={{
            authToken, setAuthToken,
            user, setUser,
            userEmail, setUserEmail,
            userPass, setUserPass,
            role, setRole,
        }} >
            {children}
        </AuthContext.Provider>
    )
}



