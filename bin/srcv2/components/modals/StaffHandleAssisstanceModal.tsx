import { onSnapshot, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { tableRef, placedOrderRef } from "../../config/firebase";
import { checkMark, deny } from "../../assets/assets";
import { FoodItem } from "../../hooks/useMenu";
import { PlacedOrder, useOrder } from "../../hooks/useOrder";
import { OverviewComponent } from "../OverviewComponent";
import { OrderStatusModal } from "./OrderStatusModal";
import { RequestAssistanceModal } from "./RequestAssistanceModal";
import { RequestBillModal } from "./RequestBillModal";

interface StaffHandleAssisstanceModalProps {
    tableID: string;
    closeModal: (modalState: boolean) => void;
    handleLoadProp: (loadState: boolean) => void;
};

interface FoodObj {
    foodObj: FoodItem;
    quantity: number;
    rank: number;
};
export const StaffHandleAssisstanceMdal = ({tableID, closeModal, handleLoadProp}: StaffHandleAssisstanceModalProps) => {
    const [isRequestingBill, setIsRequestingBill] = useState<boolean>(false);
    const [isRequestingAssistance, setIsRequestingAssistance] = useState<boolean>(false);
    const [isOrdering, setIsOrdering] = useState<boolean>(false);
    const [viewingOrder, setViewingOrder] = useState<boolean>(false);
    const [tableNumber, setTableNumber] = useState<number>(0);
    const [orderID, setOrderID] = useState<string>('');
    const [orderList, setOrderList] = useState<FoodObj[]>();
    const [totalPrice, setTotalPrice] = useState<number>(0);

    useEffect(() => {
        try {
            const unsubscribe = onSnapshot(query(tableRef, where('tableID', '==', tableID)), (snapshot) => {
                const tableData = snapshot.docs[0].data();
                setIsRequestingBill(tableData.isRequestingBill);
                setIsRequestingAssistance(tableData.isRequestingAssistance);
                setIsOrdering(tableData.isOrdering);
                setTableNumber(tableData.tableNumber);
                setOrderID(tableData.orderID);
            });
            return () => unsubscribe();
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        }
        
    }, []);

    useEffect(() => {
        try {
            const unsubscribe = onSnapshot(query(placedOrderRef, where('id', '==', tableID)), (snapshot) => {
                const tableOrdersData = snapshot.docs[0].data() as PlacedOrder;
                let orders: FoodObj[] = [];
                let localPrice = 0;
                tableOrdersData.orders.map((order) => {
                    orders.push(order);
                    localPrice += (order.foodObj.price * order.quantity);
                });
                setTotalPrice(localPrice);
                setOrderList(orders);
            });
            return () => unsubscribe();
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        }
        
    }, []);
  
    return (
        <>
            <div onClick = {() => closeModal(false)} style = {{
                background: 'rgba(1, 9, 23, 0.7)',
                position: 'absolute',
                zIndex: '11',
                height: '100%', 
                width: '100%',
                alignItems: 'center',
                boxSizing: 'border-box',
            }}></div>
            <div style={{
                position: 'absolute',
                top: '50%',
                zIndex: '12',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',      
                borderRadius: '2%',
                width: '300px',
                height: '150px',
                marginLeft: 'auto',
                marginRight: 'auto',
                background: 'white',
                border: 'none',
            }}>
                <h1>Table {tableNumber} Overview</h1>
                <p>Order Details</p>
            {orderList?.map((obj) => {
                return (
                    <OverviewComponent 
                        foodName = {obj.foodObj.foodName}
                        quantity= {obj.quantity}
                        price = {obj.foodObj.price}
                    />
                )
            })}
            <p>Total {totalPrice}PHP</p>
            {isRequestingBill && (
                <div>
                    <RequestBillModal
                        handleCloseMainModal = {(exitState) => closeModal(exitState)}
                        handleExit={(exitState) => setIsRequestingAssistance(exitState)}
                        tableID={tableID}
                        handleLoadProp={(loadState) => handleLoadProp(loadState)} 
                        orderID = {orderID} 
                    />
                </div>
            )}
            {isRequestingAssistance && (
                <div>
                    <RequestAssistanceModal
                        handleCloseModal = {(exitState) => closeModal(false)}
                        handleExit={(exitState) => setIsRequestingAssistance(exitState)}
                        tableID={tableID}
                        handleLoadProp={(loadState) => handleLoadProp(loadState)}  
                    />
                </div>
            )}
            {(!isRequestingAssistance && !isRequestingBill) && (
                <> 
                    {viewingOrder && (
                        <OrderStatusModal 
                            handleExit = {(exitState) => setViewingOrder(exitState)}
                            orderID={orderID}
                            totalPrice={totalPrice}
                            tableID={tableID}
                            handleLoadProp={(loadState) => handleLoadProp(loadState)}               
                        />
                    )}
                    {isOrdering && (
                        <>
                            <p>Proceed to order...</p>  
                            <img style = {{zIndex: '20'}}height='50px' width='50px' src={checkMark} onClick = {() => {
                                setViewingOrder(true);
                            }}/>
                        </>
                    )}
                </> 
            )}
            </div>
        </>
    );
};