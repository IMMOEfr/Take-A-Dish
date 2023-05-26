import { FoodItem, } from './useMenu';
import { useState } from 'react';
import { updateDoc, getDocs, doc, setDoc, query, orderBy, onSnapshot, deleteDoc } from 'firebase/firestore';
import { tableRef, auth } from '../config/firebase';
import { createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
export interface tableData {
    isActive: boolean;
    isSynced: boolean;
    tableNumber: number;
    email: string;
    uid: string;
    tableID: string;
    password: string;
    displayName: string;
    orders: FoodItem[];
    orderID: string;
    isRequestingBill: boolean;
    isRequestingAssistance: boolean;
    isOrdering: boolean;
}
export const useTable = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const createTable = async (count: number) => {
        try{
            setIsLoading(true);
            const docRef = doc(tableRef);
            const newTable: tableData = {
                isActive: false,
                isSynced: false,
                tableNumber: count,
                email: '',
                password: '',
                uid: '',
                displayName: '',
                orders: [],
                tableID: docRef.id,
                orderID: '',
                isRequestingBill: false,
                isRequestingAssistance: false,
                isOrdering: false,
            };
            await setDoc(docRef, newTable);
            await createUserWithEmailAndPassword(auth, `${newTable.tableID}@gmail.com`,`${newTable.tableID}`).then(
                (userCredential) => {
                    updateProfile(userCredential.user, {
                        displayName: newTable.tableID
                    });
                    console.log(docRef);
                    updateDoc(docRef, { 
                        email: newTable.tableID,
                        uid: userCredential.user.uid,
                        password: newTable.tableID,
                        displayName: newTable.tableID,
                    });
                }
            );
        } catch (error:unknown) {
            if (error instanceof Error) {console.log(error.message);}
        } finally {
            setIsLoading(false);
        }
    }


    const deleteTable = async (tableID: string) => {
        try {
            setIsLoading(true);
            const tableDocRef = doc(tableRef, tableID);
            await signInWithEmailAndPassword(auth, `${tableID}@gmail.com`, tableID);
            const user = auth.currentUser;
            if(user)
                deleteUser(user).then(() => {
                    console.log('deleted');
                }).catch((error) => {
                    if(error instanceof Error) console.log(error.message);
                });
            await deleteDoc(tableDocRef);
            await signInWithEmailAndPassword(auth, 'admin@gmail.com', 'admin1');
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            setIsLoading(false);
        }   
    };
    return { isLoading, createTable, deleteTable };
};