import { FoodItem } from "../hooks/useMenu";
import { createContext, useState } from "react";


type ItemContextProviderProps = {
    children: React.ReactNode;
}

type ItemContextType = {
    foodEdit: FoodItem | null;
    setFoodEdit: React.Dispatch<React.SetStateAction<FoodItem | null>>
}
export const ItemContext = createContext({} as ItemContextType);

export const ItemContextProvider = ({children}: ItemContextProviderProps) => {
    const [foodEdit, setFoodEdit] = useState<FoodItem | null>(null);
    return (
        <ItemContext.Provider value={{foodEdit, setFoodEdit}}>
            {children}
        </ItemContext.Provider>
    )
}