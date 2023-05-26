import { useState } from "react";
import { pinRef, auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut} from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { MENUROUTE } from "../lib/routes";

interface PinCode {
    passcode: string; 
};

export const useAuth = () => {
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const navigate = useNavigate();

    const modalLogin = async (pinIN: string) => {
        try{
            const pinDoc = await getDoc(doc(pinRef, '4PGYzq9dtkFOJVdC2J9M'));
            const pinCode: PinCode = pinDoc.data() as PinCode;
            if(pinCode.passcode == pinIN){
                await signInWithEmailAndPassword(auth, 'admin@gmail.com', 'admin1');
            } else {
                throw new Error('Invalid pin');
            }
            localStorage.setItem('request', 'syncDevice');
            localStorage.setItem('userID', `${auth.currentUser?.uid}`);
            return true;
        }catch(error: unknown) {
            if(error instanceof Error) {alert(error.message)}
        }
    }

    const login = async (pinIN: string, email: string) => {
        try {
            setIsLoading(true);
            let pinDoc;
            if(email === 'staff@gmail.com')
                pinDoc = await getDoc(doc(pinRef, 'rKLcMVwS1fx7Dx8MUd9N'));
            else if(email === 'admin@gmail.com')
                pinDoc = await getDoc(doc(pinRef, '4PGYzq9dtkFOJVdC2J9M'));
            else throw new Error(`Document could not be found.`);
            const pinCode: PinCode = pinDoc.data() as PinCode;
            if (pinCode.passcode === pinIN && (email === 'staff@gmail.com')) {
                await signInWithEmailAndPassword(auth, 'staff@gmail.com', 'staff123');
                // localStorage.setItem('isLoggedIn', 'true'); 
                localStorage.setItem('accountType', 'staff');
            }else if(pinCode.passcode == pinIN && (email === 'admin@gmail.com')) {
                await signInWithEmailAndPassword(auth, 'admin@gmail.com', 'admin1');
                // localStorage.setItem('isLoggedIn', 'true'); //can simplify later
                localStorage.setItem('accountType', 'admin');
            } else {
                throw new Error('Invalid pin');
            }
            localStorage.setItem('userID', `${auth.currentUser?.displayName}`);
            return true;
        } catch(error: unknown) {
            if(error instanceof Error) {alert(error.message)}
        } finally {
            setIsLoading(false);
        }
    };
    const logout = async (navigateTo: string) => {
        
        try {
            if(!auth.currentUser?.email)
                return;
            await signOut(auth);
            localStorage.clear();
            navigate(navigateTo);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        }
    };

    return { modalLogin, login, logout, isLoading };
};