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

interface ErrorModalProps {
    closeModal: (modalState: boolean) => void;
};

export const ErrorModal = ({closeModal}: ErrorModalProps) => {
  
    return (
        <>
            <div onClick = {() => closeModal(false)} style = {{
                zIndex: '4',
                position: 'absolute',
                top: '0',
                left: '0',
                bottom: '0',
                right: '0',
                background: 'rgba(0, 0, 0, 0.5)',
            }}></div>
            <div style={{
                zIndex: '5',
                background: 'white',
                position: 'fixed',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%,-50%)',
                borderRadius: '5px',
                height: '30%',
                width: '50%',
                paddingLeft: '10px',
            }}>
              
            <p> 
            THIS DEVICE IS CURRENTLY IN SYNC. UNSYNC DEVICE FIRST TO DELETE.
            </p>
            </div>        
        </>
    );
};