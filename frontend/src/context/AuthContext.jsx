/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => {
        return localStorage.getItem('token')
    })

    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user')

            if (!storedUser || storedUser === 'undefined') {
                return null
            }

            return JSON.parse(storedUser)

        } catch {
            return null
        }
    })

    const login = (newToken, newUser) => {
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(newUser))

        setToken(newToken)
        setUser(newUser)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{ token, user, login, logout }}        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}