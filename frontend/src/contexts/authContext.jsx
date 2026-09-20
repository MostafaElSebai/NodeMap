import useAuth from "../hooks/useAuth"
import { createContext, useEffect } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const { user, loading, verifyUser, handleLogin, handleRegister, handleRegisterGuest, handleGuestLogin, handleLogout } = useAuth()

    useEffect(() => {
        verifyUser()
    }, [])


    if (loading) {
        return <h1>Checking authentication...</h1>
    }

    const globalState = {
        user,
        loading,
        handleLogin,
        handleRegister,
        handleRegisterGuest,
        handleGuestLogin,
        handleLogout
    }
    return (<AuthContext.Provider value={globalState}>
        {children}
    </AuthContext.Provider>)
}

