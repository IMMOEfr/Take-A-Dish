import { useState } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { tableRef } from "../config/firebase";
import { tableData } from "../hooks/useTable";
import { TableData } from "../pages/user/cart";
import { useQuantity } from "../hooks/useQuantity";

interface FoodProps {
    foodName: string,
    imageURL: string,
    price: number,
    quantity: number,
}


export const FoodComponent = ({foodName, imageURL, price, quantity}: FoodProps) => {
    const [quantityState, setQuantityState] = useState<number>(quantity);
    const { incrementItem, decrementItem } = useQuantity();

    const handleIncrement= async (foodName: string) => {
        try {
            await incrementItem(foodName);
            setQuantityState(quantityState + 1);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        }
    };

    const handleDecrement= async (foodName: string) => {
        try {
            await decrementItem(foodName);
            if(quantityState == 0){
                setQuantityState(0);
            }
            setQuantityState(quantityState - 1);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        }
    };
    
    return (
         <div className = 'cardComponent'>
            <img src = {imageURL}/>
            <p>{foodName}</p>
            <p>{price}PHP</p>
            <button type = 'button' onClick = {() => handleDecrement(foodName)}>-</button>
            <div>{quantity}</div>
            <button type = 'button' onClick = {() => handleIncrement(foodName)}>+</button>
        </div> 
    );
}