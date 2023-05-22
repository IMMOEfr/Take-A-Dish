import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { TableData } from "../pages/user/cart";
import { menuRef, placedOrderRef, tableRef } from "../config/firebase";
import { FoodItem } from "./useMenu";
import { useState } from "react";


// interface FoodObj {
//     foodObj: FoodItem;
//     quantity: number;
// };

// interface PlacedOrder {
//     tableID: string;
//     orders: FoodObj[];
// };
interface CartItems{
    tableID: string;
    foodName: string;
    price: number;
    category: string;
    imageURL: string;
    isAvailable: boolean;
    id: string;
    quantity: number;
}
interface PlacedOrder{
    orders: CartItems[];
}
export const useOrder = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const placeOrder = async (orderIn: TableData) => {
        try {
            setIsLoading(true)
            const tableID = localStorage.getItem('userID');
            if(!tableID) throw new Error('No Table Id...');

            //getting table document
            const orderDoc = doc(tableRef, tableID);
            const orderDocRef = await getDoc(orderDoc);
            const orderSnap = orderDocRef.data() as PlacedOrder;    
            console.log(orderSnap.orders);  
            orderSnap.orders.map(async (order) => {
                const foodDoc = doc(menuRef, order.id);
                const foodDocRef = await getDoc(foodDoc);
                const foodSnap = foodDocRef.data() as FoodItem;
                const newConsumers = foodSnap.consumers.filter((consumer) => {
                    if(consumer != tableID) return 1;
                })
                await updateDoc(foodDoc, {
                    consumers: newConsumers
                });
                //getting order document with table id
                alert("passed");
                const newPlacedOrderDocument = doc(placedOrderRef, tableID);
                alert("passed");
                console.log(newPlacedOrderDocument);

                const newPlacedOrderSnapshot = await getDoc(newPlacedOrderDocument); 

                //updating order doc if there exists a previous order
                // if(newPlacedOrderSnapshot.data.length > 0){
                //     console.log("updating");
                //     const newPlacedOrders = [orderSnap.orders];
                //     await updateDoc(newPlacedOrderDocument, {
                //     orders: newPlacedOrders,
                // })
                // }
                //creating new doc for orders of that table id
                // else{
                    console.log("creating");
                    console.log("storing order: ", orderSnap.orders);
                    const newCart: CartItems = {
                        tableID: order.tableID,
                        foodName: order.foodName,
                        price: order.price,
                        category: order.category,
                        imageURL: order.imageURL,
                        isAvailable: order.isAvailable,
                        id: order.id,
                        quantity: order.quantity,
                    } 
                    const newPlacedOrderArr = newCart as unknown as CartItems[];
                    console.log("Inserting to order field: ", newPlacedOrderArr);
                    const newPlacedOrders: PlacedOrder = {
                        orders: newPlacedOrderArr,
                    }
                    
                
                   


                    // console.log(map);

                    // console.log(newPlacedOrders);
                    await setDoc(newPlacedOrderDocument, newPlacedOrders);
                // }
                
                // const placedOrderBuffer = {
                //     category: foodSnap.category,
                //     foodName: foodSnap.foodName,
                //     id: foodSnap.id,
                //     imageURL: foodSnap.imageURL,
                //     isAvailable: foodSnap.isAvailable,
                //     price: foodSnap.price
                // };

                // const lastBufferIswear = {
                //     foodObj: placedOrderBuffer,
                //     quantity: order.quantity,
                // };
                // console.log('---------------------------------------')
                // console.log('lastBuffer:')
                // console.log(lastBufferIswear);
                // console.log('---------------------------------------')
                // const newPlacedOrderDocument = doc(placedOrderRef, tableID);
                // const newPlacedOrderSnapshot = await getDoc(newPlacedOrderDocument); 
                // const placedOrderData = newPlacedOrderSnapshot.data() as PlacedOrder;
                // let newPlacedOrderArr: FoodObj[];
                // if(placedOrderData) {
                //     console.log("Here");
                //     newPlacedOrderArr = [lastBufferIswear, ...placedOrderData.orders] as unknown as FoodObj[];
                //     await updateDoc(newPlacedOrderDocument, {
                //         orders: newPlacedOrderArr,
                //     });
                // } else {
                //     console.log("Adding");
                //     newPlacedOrderArr = [lastBufferIswear] as unknown as FoodObj[];
                //     await setDoc(newPlacedOrderDocument, {
                //         id: tableID,
                //         orders: newPlacedOrderArr,
                //     });
                // }
                // console.log('---------------------------------------')
                // console.log('newPlacedOrderArr:')
                // console.log(newPlacedOrderArr);
                // console.log('---------------------------------------')
                // // const newPlacedOrderArr = [orderSnap.orders, ...placedOrderData.orders];
                // // if(newPlacedOrderSnapshot.exists()) { // Exists, we need to update
                // //     console.log('UPDATING')
                // //     await updateDoc(newPlacedOrderDocument, {
                // //         orders: newPlacedOrderArr,
                // //     });
                // // } else { // It doesnt exist, lets add it 
                //     // console.log('ADDING');
                //     // await setDoc(newPlacedOrderDocument, {
                //     //     id: tableID,
                //     //     orders: newPlacedOrderArr,
                //     // });
                // // }
            });
            // await updateDoc(orderDoc, {
            //     orders: [],
            //     isActive: true,
            // }); 
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    return { placeOrder }
};

