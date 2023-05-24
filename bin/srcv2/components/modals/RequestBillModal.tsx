import { useEffect, useState } from "react";
import { checkMark } from "../../assets/assets";
import { useWaiter } from "../../hooks/useWaiter";
import { useNavigate } from "react-router-dom";
import { useReceipt } from "../../hooks/useReceipt";
import { onSnapshot, query, where } from "firebase/firestore";
import { placedOrderRef, tableRef } from "../../config/firebase";

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
                    <div style = {{
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
                        <button onClick = {() => confirmPayment()}>CONFIRM PAYMENT</button>
                    </div>
                </>
            )}
            <div>
                <p>Requesting for bill...</p><img height='50px' width='50px' src={checkMark} onClick={() => confirmBill()}/>
            </div>
        </>
    );
};