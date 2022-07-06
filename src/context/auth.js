
import { createContext, useState, useRef } from "react";


export const AuthContext = createContext({});


export const AuthProvider = ({ children }) => {
    const[user, setUser] = useState(false)
    const[authToken, setAuthToken] = useState(null)
    const[role, setRole] = useState(null)

    return (
        <AuthContext.Provider value={{
            user, setUser,
            authToken, setAuthToken,
            role, setRole,
        }} >
            {children}
        </AuthContext.Provider>
    )
}



