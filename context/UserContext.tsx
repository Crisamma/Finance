"use client";

import { createContext, useContext } from "react";

export const UserContext = createContext({
    username: "",
});

type UserProviderProps = {
    username: string;
    children: React.ReactNode;
};

export function UserProvider({ username, children }: UserProviderProps) {
    return (
        <UserContext.Provider value={{ username }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}