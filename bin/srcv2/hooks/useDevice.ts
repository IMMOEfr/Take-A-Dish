import { signInWithEmailAndPassword, signOut, setPersistence, browserLocalPersistence, reauthenticateWithCredential } from 'firebase/auth'
import { useState } from 'react';
import { auth, tableRef } from '../config/firebase';
import { updateDoc, doc } from 'firebase/firestore';

export const useDevice = () => {
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const syncTable = async (tableID: string) => {
        try {
            setIsLoading(true);
            const tableDoc = doc(tableRef, `${tableID}`);
            console.log(tableID);
            // setPersistence(auth, browserLocalPersistence)
            // .then(() => {
            await signInWithEmailAndPassword(auth,`${tableID}@gmail.com`, `${tableID}`);
            // });
            await updateDoc(tableDoc, {
                isSynced: true,
            });
        } catch(error: unknown) {
            if(error instanceof Error) {alert(error.message)}
        } finally {
            localStorage.setItem('tableID', `${auth.currentUser?.displayName}`);
            localStorage.setItem('userID', `${auth.currentUser?.displayName}`);
            localStorage.setItem('accountType', 'user');
            localStorage.removeItem('request');
            setIsLoading(false);
        }
    }
    const unsyncTable = async(id: string) => {
        try {
            await signOut(auth);
            const tableDoc = doc(tableRef, `${id}`);
            console.log(tableDoc);
            await updateDoc(tableDoc, {
                isSynced: false,
            });
            localStorage.clear();
        }catch(error: unknown) {
            if(error instanceof Error) {alert(error.message)}
        }
    }
    return {isLoading, syncTable, unsyncTable}
}