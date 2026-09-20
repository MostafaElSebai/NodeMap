
import { useState } from "react"
import { useNavigate } from "react-router"
import { login, register, logout, registerAsGuest, registerGuest, showMe } from "../APIs/auth"
import toast from "react-hot-toast";

export default function useAuth() {

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    const navigate = useNavigate()

    const handleLogin = async (email, password) => {
        try {
            const response = await login({ email, password })
            setUser(response.user)
            setLoading(false)
            toast.success("Logged in successfully")
            navigate('/boards')
            return response
        } catch (error) {
            toast.error(error.response?.data?.msg || "Something went wrong")
            setLoading(false)
            return error?.response?.data?.msg

        }

    }
    const handleRegister = async (name, email, password) => {
        try {
            const response = await register({ name, email, password })
            setUser(response.user)
            setLoading(false)
            toast.success("Registered successfully")
            navigate('/boards')
        } catch (error) {
            toast.error(error.response?.data?.msg || "Something went wrong")
            setLoading(false)
            return error?.response?.data?.msg

        }
    }

    const handleRegisterGuest = async (name, email, password) => {
        try {
            setLoading(true);
            const response = await registerGuest({ name, email, password })
            setUser({ ...response, role: "user" })
            setLoading(false)
            toast.success("Account claimed successfully")
            navigate('/boards')
        } catch (error) {
            toast.error(error.response?.data?.msg || "Something went wrong")
            setLoading(false)
            return error?.response?.data?.msg
        }
    }

    const handleGuestLogin = async () => {
        try {
            const response = await registerAsGuest()
            setUser(response)
            setLoading(false)
            toast.success("Logged in as guest")
            navigate('/boards')
        } catch (error) {
            toast.error(error.response?.data?.msg || "Something went wrong")
            setLoading(false)
            return error?.response?.data?.msg

        }
    }

    const verifyUser = async () => {
        try {
            const user = await showMe()
            setUser(user)
            setLoading(false)
            return user
        } catch (error) {
            console.log(error?.response?.data?.msg);
            setLoading(false)
            return error?.response?.data?.msg

        }
    }

    const handleLogout = async () => {
        try {
            const response = await logout()
            setUser(null)
            setLoading(false)
            toast.success("Logged out successfully")
            navigate('/')
            return response
        } catch (error) {
            toast.error(error.response?.data?.msg || "Something went wrong")
            setLoading(false)
            return error?.response?.data?.msg

        }
    }

    return { handleLogin, handleRegister, handleRegisterGuest, handleLogout, handleGuestLogin, verifyUser, user, loading }
}