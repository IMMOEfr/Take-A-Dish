import { FieldValue, arrayRemove, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { TableData } from "../pages/user/cart";
import { menuRef, placedOrderRef, queueRef, tableRef, billsRef } from "../config/firebase";
import { FoodItem } from "./useMenu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { STATUSROUTE } from "../lib/routes";

interface FoodObj {
    foodObj: FoodItem;
    quantity: number;
    rank: number;
};

export interface PlacedOrder {
    tableID: string;
    orders: FoodObj[];
    nextRank: number;
};

interface Queue {
    customerQueue: string[];
};


interface Bill {
    orderID: string;
    progressArr: boolean[];
};


export const useOrder = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const placeOrder = async (orderIn: TableData, totalPrice: number) => {
        try {
            setIsLoading(true);
            // Grabbing the Table ID
            const tableID = localStorage.getItem('userID');
            if(!tableID) throw new Error('No Table Id...');

            /*
            *    Step 1:
            *        Check if the Table already has a Placed Order.
            *        If They don't, lets create a new instance of the document.
            *        Otherwise, let's just proceed.
            */
            const newPlacedOrderDoc = doc(placedOrderRef, tableID);
            const newPlacedOrderSnap = await getDoc(newPlacedOrderDoc);
            if(!newPlacedOrderSnap.exists()) {
                await setDoc(newPlacedOrderDoc, {
                    id: tableID,
                    orders: [],
                    nextRank: 1,
                });
            };

            /*
            *   Step 2:
            *       For every Food Item that exists in 'orderIn', we will now o ahead
            *       and push that into the created placedOrders collection array.
            */
            const newPlacedOrderDocBuffer = doc(placedOrderRef, tableID);
            const newPlacedOrderSnapBuffer = await getDoc(newPlacedOrderDocBuffer);
            const newPlacedOrderDataBuffer = newPlacedOrderSnapBuffer.data() as PlacedOrder;
            let newPlacedOrdersArr: FoodObj[] = newPlacedOrderDataBuffer.orders;
            let sum = 0;
            orderIn.orders.map(async(order) => {
                const FoodItem = {
                    category: order.foodObj.category,
                    foodName: order.foodObj.foodName,
                    id: order.foodObj.id,
                    imageURL: order.foodObj.imageURL,
                    isAvailable: order.foodObj.isAvailable,
                    price: order.foodObj.price,
                };
                const FoodItemObject = {
                    foodObj: FoodItem,
                    quantity: order.quantity,
                    rank: newPlacedOrderDataBuffer.nextRank,
                } as FoodObj;
                newPlacedOrdersArr.push(FoodItemObject);
                sum += order.quantity * order.foodObj.price;
            });
            await updateDoc(newPlacedOrderDoc, {            
                orders: newPlacedOrdersArr,
                nextRank: newPlacedOrderDataBuffer.nextRank + 1,
            });

            /*
            *   Step 3:
            *       We need to update each Food Item's Consumer Array. (removing the table)
            *       We need to remove the item the item
            *       Finally, we set the table to true
            */
            const tableOrdersDoc = doc(tableRef, tableID); // TableRef Orders
            const tableOrdersRef = await getDoc(tableOrdersDoc);
            const tableOrdersData = tableOrdersRef.data() as PlacedOrder;
            tableOrdersData.orders.map(async (order) => {
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
            /*
            *   Step 6:
            *       Create a nw instance of a document for the Bills, so we have access
            *       to the orderID. Then we update the table's orderID so we can link them
            *       together
            */
            const billsDocRef = doc(billsRef);
            await setDoc(billsDocRef, {
                orderID: billsDocRef.id,
                progressArr: [true, false, false, false, false],
            }) 
            await updateDoc(tableOrdersDoc, {
                orders: [],
                isActive: true,
                orderID: billsDocRef.id,
                isOrdering: true,
            });
            /*
            *   STEP 4:
            *        Push the TableID into the Queue.
            */
            const queueDocRef = doc(queueRef, 'V5D5zklsIJ6166Y862mz');
            const queueDocSnap = await getDoc(queueDocRef);
            const queueData = queueDocSnap.data() as Queue;
            const newCostumerQueue = queueData.customerQueue;
            newCostumerQueue.push(tableID);
            await updateDoc(queueDocRef, {
                customerQueue: newCostumerQueue
            });
            /*
            *   STEP 5:
            *        PUSH TO LOCAL STORAGE
            */
            localStorage.setItem('orderTotalPrice', `${sum}`);
            localStorage.setItem('orderID', `${billsDocRef.id}`);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            setIsLoading(false);
            navigate(STATUSROUTE);
        }
    };

    const updateOrderProgress = async (orderID: string, tableID: string) => {
        try {
            setIsLoading(true);
            const billsDocRef = doc(billsRef, orderID);
            const billDocSnap = await getDoc(billsDocRef);
            const billData = billDocSnap.data() as Bill;
            const updatedProgressArr: boolean[] = [];
            let nextStepCount = 0;
            let booleanExpressionCount = 1;
            billData.progressArr.map((booleanExpression) => {
                if(booleanExpression === false && nextStepCount < 1) {
                    nextStepCount += 1;
                    updatedProgressArr.push(true);
                } else {
                    updatedProgressArr.push(booleanExpression);
                }
                if(booleanExpression === true) booleanExpressionCount += 1;
            });

            await updateDoc(billsDocRef, {
                progressArr: updatedProgressArr,
            });

            if(booleanExpressionCount === 5) { // There are a total of 5 Steps...
                /*Then Set isOrdering to false*/
                const tableDoc = doc(tableRef, tableID);
                await updateDoc(tableDoc, {
                    isOrdering: false,
                });

                /*Once all true remove from queue doc*/
                // const placedOrderDoc = doc(placedOrderRef, tableID);
                // const placedOrderSnap = await getDoc(placedOrderDoc);
                // const placedOrderData = placedOrderSnap.data() as PlacedOrder;
                const queueDocRef = doc(queueRef,'V5D5zklsIJ6166Y862mz');
                await updateDoc(queueDocRef, {
                    customerQueue: arrayRemove(tableID),
                });
            }
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { placeOrder, isLoading, updateOrderProgress};
};