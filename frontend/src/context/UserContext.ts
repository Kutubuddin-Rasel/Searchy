import React, { createContext } from "react";

interface UserNameContextType{
    userName:String;
    setUserName:React.Dispatch<React.SetStateAction<String>>;
}
export const UserContext = createContext<UserNameContextType |null>(null)

export const UserContextProvider = UserContext.Provider;

export default function useUser(){
    
}