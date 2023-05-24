import { useState } from "react";
import { getDoc, doc, updateDoc, deleteField } from "firebase/firestore";
import { menuRef, tableRef } from "../config/firebase";
import { TableData } from "../pages/user/cart";
import { FoodItem } from "./useMenu";



export const useQuantity = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const incrementItem = async (foodName: string) => {
        try{
            setIsLoading(true);
            const tableID = localStorage.getItem('userID');
            if(tableID) {
                const orderDoc = doc(tableRef, tableID);
                const orderDocRef = await getDoc(orderDoc);
                const orderSnap = orderDocRef.data() as TableData;
                console.log(orderSnap);
                const index = orderSnap.orders.map(e => e.foodObj.foodName).indexOf(foodName);
                
                if(index !== -1) {
                    const updatedOrders = [...orderSnap.orders];
                    updatedOrders[index].quantity += 1;
                    await updateDoc(orderDoc, {
                        orders: updatedOrders
                    });
                } else {
                    throw new Error('Shit went bad');
                }
            }
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const decrementItem = async (foodName: string) => {
        try {
            setIsLoading(true);
            const tableID = localStorage.getItem('userID');
            if(tableID) {
                const orderDoc = doc(tableRef, tableID);
                const orderDocRef = await getDoc(orderDoc);
                const orderSnap = orderDocRef.data() as TableData;
                const cartIndex = orderSnap.orders.map(e => e.foodObj.foodName).indexOf(foodName);
                if(cartIndex !== -1) {
                    let isRemovingItem: boolean = false;
                    const updatedOrders = [...orderSnap.orders];
                    updatedOrders[cartIndex].quantity -= 1;
                    const foodID = updatedOrders[cartIndex].foodObj.id;
                    const foodDoc = doc(menuRef, foodID);
                    const foodDocRef = await getDoc(foodDoc);
                    const foodSnap = foodDocRef.data() as FoodItem;
                    // const consumerIndex = orderSnap.orders.map(e => e.foodObj.foodName).indexOf(foodName);
                    const filteredConsumers = foodSnap.consumers.filter((consumer) => {
                        if(consumer != tableID)
                            return 1;
                    })
                    if(updatedOrders[cartIndex].quantity == 0) isRemovingItem = true;
                    if(isRemovingItem) {
                        const filteredArr = orderSnap.orders.filter((obj) => {
                            if(obj.quantity > 0) return 1;
                        }); 
                        await updateDoc(orderDoc, { orders: filteredArr }); // Removed Item from Table Arr
                        await updateDoc(foodDoc, { consumers: filteredConsumers }) // Removed Item from Menu Arr
                    } else await updateDoc(orderDoc, { orders: updatedOrders }); 
                } else {
                    throw new Error('Shit went bad');
                }
            }
        } catch(error: unknown) {
            if(error instanceof Error) {console.log(error.message)}
        } finally {

        }
    };
    return { incrementItem, decrementItem };

};