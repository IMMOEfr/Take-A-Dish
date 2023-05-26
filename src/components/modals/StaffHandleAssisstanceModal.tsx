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
import "../../stylesheets/TableOverviewStyle.css";
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
            <div className="background"onClick = {() => closeModal(false)}></div>
            <div className="modalContainer">
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
                    
                </> 
            
                <h1 className="TableH1">Table {tableNumber} Overview</h1>
            <div className="orderDetailsContainer"> <p className="orderH1"><b>Order Details</b></p>
            {orderList?.map((obj) => {
                return (
                    <div className="orderDetails">
                        <span className="food-name">{obj.foodObj.foodName}</span>
                        <span className="food-quantity">(x{obj.quantity})</span>
                        <span className="food-price">{obj.foodObj.price} PHP</span>
                    </div>
                )
            })}
            <p className="total"><b>Total: <span className="total-price">{totalPrice} PHP</span></b></p>
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
            </div>
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
            {isOrdering && (
                        <>
                            <p className="proceedBTN">Proceed to order...</p>  
                            <img className="checkbtn" src={checkMark} onClick = {() => {
                                setViewingOrder(true);
                            }}/>
                        </>
                    )}
            </div>
        </>
    );
};