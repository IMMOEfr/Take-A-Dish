import { useState } from 'react';
import { placedOrderRef, tableRef} from '../config/firebase';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { tableData } from './useTable';

export const useWaiter = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const handleRequestedAssistance = async (tableID: string) => {
        try {
            setIsLoading(true);
            const tableDocRef = doc(tableRef, tableID);
            const tableDocSnap = await getDoc(tableDocRef);
            const tableDocData = tableDocSnap.data() as tableData;
            await updateDoc(tableDocRef, {
                isRequestingAssistance: !tableDocData.isRequestingAssistance,
            });
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            setIsLoading(false);
        };
    };
    const handleRequestedBill = async (tableID: string) => {
        try {
            setIsLoading(true);
            const tableDocRef = doc(tableRef, tableID);
            const tableDocSnap = await getDoc(tableDocRef);
            const tableDocData = tableDocSnap.data() as tableData;
            await updateDoc(tableDocRef, {
                isRequestingBill: !tableDocData.isRequestingBill,
            });
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    const handlePayment = async (tableID: string) => {
        try {
            setIsLoading(true);
            const tableDocRef = doc(tableRef, tableID);
            await updateDoc(tableDocRef, {
                isActive: false,
            });
            const placedOrderDocRef = doc(placedOrderRef, tableID);
            await deleteDoc(placedOrderDocRef);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    return {handleRequestedAssistance, handleRequestedBill, handlePayment, isLoading};
};