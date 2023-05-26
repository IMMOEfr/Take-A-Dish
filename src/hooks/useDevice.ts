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
            console.log(`${auth.currentUser?.uid}`);
            // setTimeout(async ()=>{
            //     await signOut(auth);
            // },1000);
            setTimeout(async ()=> {
                await signInWithEmailAndPassword(auth,`${tableID}@gmail.com`, `${tableID}`);
            },3000);
            await updateDoc(tableDoc, {
                isSynced: true,
            });
            
        } catch(error: unknown) {
            if(error instanceof Error) {alert(error.message)}
        } finally {
            setTimeout(async ()=> {
                localStorage.setItem('tableID', `${auth.currentUser?.displayName}`);
                localStorage.setItem('userID', `${auth.currentUser?.displayName}`);
                localStorage.setItem('accountType', 'user');
                localStorage.removeItem('request');
                setIsLoading(false);
            },4000);
            
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