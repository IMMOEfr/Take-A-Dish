import { useEffect, useState } from "react";
import { checkMark } from "../../assets/assets";
import { useWaiter } from "../../hooks/useWaiter";
import { useNavigate } from "react-router-dom";
import { useReceipt } from "../../hooks/useReceipt";
import { onSnapshot, query, where } from "firebase/firestore";
import { placedOrderRef, tableRef } from "../../config/firebase";
import "../../stylesheets/TableOverviewStyle.css";

import { FoodObj } from "../../pages/user/cart";


interface PlacedOrderType {
    orders: FoodObj[];
    quantity: number;
};

interface RequestBillModalProps{
    tableID: string;
    orderID: string;
    handleLoadProp: (loadState: boolean) => void;
    handleExit: (loadState: boolean) => void;
    handleCloseMainModal: (loadState: boolean) => void;  
};

export const RequestBillModal = ({tableID, handleLoadProp, handleExit, handleCloseMainModal, orderID}: RequestBillModalProps) => {
    const [hasConfirmedBill, setHasConfirmedBill] = useState<boolean>(false);
    const [placedOrders, setPlacedOrders] = useState<FoodObj[]>([]);
    const {handleRequestedBill, handlePayment} = useWaiter();
    const {generatePDF} = useReceipt();
    const navigate = useNavigate();
    const confirmBill = async () => {
        try {
            handleLoadProp(true);
            await generatePDF(tableID, placedOrders, orderID);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            handleLoadProp(false);
            setHasConfirmedBill(true);
        }
    };

    const confirmPayment = async () => {
        try {
            handleLoadProp(true);
            localStorage.setItem('deletingTable', `${tableID}`);
            await handleRequestedBill(tableID);  
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            handleLoadProp(false);
            handleCloseMainModal(false);
            setHasConfirmedBill(false);
            handleExit(false);
        }
    };
    
    useEffect(() => {
        try {
            const unsubscribe = onSnapshot(query(placedOrderRef, where('id', '==', tableID)), (snapshot) => {
                const placedOrderDocData = snapshot.docs[0].data() as PlacedOrderType;
                setPlacedOrders(placedOrderDocData.orders);
            });

            return () => unsubscribe();
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        }
        
    }, []);

    return(
        <>
            {hasConfirmedBill && (
                <>
                    <div className = "paymentBackground"></div>
                    <div>             
                        <button className="confirmBTN" onClick = {() => confirmPayment()}>CONFIRM PAYMENT</button>
                    </div>
                </>
            )}
            <div>
                <p className="requestBill">Requesting for bill...</p>
                <img className="checkbtn"src={checkMark} onClick={() => confirmBill()}/>
            </div>
        </>
    );
};