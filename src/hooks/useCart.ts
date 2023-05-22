import { useState, useEffect } from "react";
import { tableRef, menuRef } from "../config/firebase";
import { updateDoc,getDoc, doc, query, where } from "firebase/firestore";
import { FoodItem } from "./useMenu";
import { auth } from "../config/firebase";
import { tableData } from "./useTable";
import { TableData } from "../pages/user/cart";

export const useCart = () => {
    const updateCart = async (foodID: string, quantity: number) => {
        try {
            // Logic:
            /*
            */
            const tableID = auth.currentUser?.displayName as string;
            console.log(tableID);
            console.log(foodID);
            
            const foodDocRef = doc(menuRef, foodID);
            const foodSnap = await getDoc(doc(menuRef, foodID));
            const tableDocRef = doc(tableRef, tableID);
            const tableSnap = await getDoc(doc(tableRef, tableID));
            
            const foodData = foodSnap.data() as FoodItem;
            const tableData = tableSnap.data() as tableData;
            const newOrders = [{foodObj: foodData, quantity: quantity}, ...tableData.orders];

            updateDoc(tableDocRef, {
                orders: newOrders
            });

            updateDoc(foodDocRef, {
                consumers: [...foodData.consumers, tableID]
            });
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        }
    }; 

    const cancelCart = async(orderIn: TableData) => {
        try {
            const tableID = localStorage.getItem('userID');
            if(!tableID) throw new Error('No Table Id...');
            const orderDoc = doc(tableRef, tableID);
            const orderDocRef = await getDoc(orderDoc);
            const orderSnap = orderDocRef.data() as TableData;
            orderSnap.orders.map(async (order) => {
                const foodDoc = doc(menuRef, order.foodObj.id);
                const foodDocRef = await getDoc(foodDoc);
                const foodSnap = foodDocRef.data() as FoodItem;
                const newConsumers = foodSnap.consumers.filter((consumer) => {
                    if(consumer != tableID) return 1;
                })
                await updateDoc(foodDoc, {
                    consumers: newConsumers
                });
            });
            await updateDoc(orderDoc, {
                orders: []
            });
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        }
    };
    
    return { updateCart, cancelCart };
};