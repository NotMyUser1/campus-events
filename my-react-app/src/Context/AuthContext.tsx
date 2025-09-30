import {createContext, type ReactNode, useContext} from "react";
import useLocalStorage from "use-local-storage";

type AuthContextType = {
    loggedIn: boolean;
    toggleLogin: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: ReactNode}) {
    const [loggedIn, setLoggedIn] = useLocalStorage("isLoggedIn", false);
    const toggleLogin = () => setLoggedIn(l => !l);

    return (
        <AuthContext.Provider value={{loggedIn, toggleLogin}}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth muss innerhalb von AuthProvider verwendet werden");
    return context;
}