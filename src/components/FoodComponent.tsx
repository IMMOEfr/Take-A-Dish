import { useState } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { tableRef } from "../config/firebase";
import { tableData } from "../hooks/useTable";
import { TableData } from "../pages/user/cart";
import { useQuantity } from "../hooks/useQuantity";
import "./../stylesheets/ShoppingCartStyle.css";

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
        <div className="cardComponent">
        <div className="left-side">
          <div className="food-details">
            <img className="iconFood" src={imageURL} />
            <div className="food-display-info">
              <p>{foodName}</p>
              <p>{price}PHP</p>
            </div>
          </div>
        </div>
  
        <div className="right-side">
          
            <button
              className="quantitybtn"
              type="button"
              onClick={() => handleDecrement(foodName)}
            >
              -
            </button>
            <button className="quantity">
            {quantity}
            </button>
            <button
              className="quantitybtn"
              type="button"
              onClick={() => handleIncrement(foodName)}
            >
              +
            </button>
        
        </div>
      </div>
    );
}