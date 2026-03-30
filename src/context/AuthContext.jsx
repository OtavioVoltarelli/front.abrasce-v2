import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => Cookies.get("token") || null);

    useEffect(() => {
        if (token) {
            Cookies.set("token", token, { 
                expires: 1 / 24, // 1 hr
                secure: true, 
                sameSite: "strict"
            });
        } else {
            Cookies.remove("token");
        }
    }, [token]);

    const login = (newToken) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
