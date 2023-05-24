import { useState } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { tableRef } from "../config/firebase";
import { tableData } from "../hooks/useTable";
import { TableData } from "../pages/user/cart";
import { useQuantity } from "../hooks/useQuantity";

interface FoodProps {
    foodName: string,
    price: number,
    quantity: number,
};

export const OverviewComponent = ({foodName, price, quantity}: FoodProps) => {
    return (
        <div className = 'cardComponent'>
           <p>{foodName}</p>
           <div>{quantity}</div>
           <p>{price}PHP</p>
       </div> 
   );
}