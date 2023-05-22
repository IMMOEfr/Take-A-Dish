import { pinRef } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface PinCode {
    passcode: string; 
};
export const usePin = () => {
    let pinDocSnap;
    let pinDoc;
    const changePin = async (oldPin: string, newPin: string, accountType: string) => {
        try {
            if(accountType === 'staff') {
                pinDocSnap = await getDoc(doc(pinRef, 'rKLcMVwS1fx7Dx8MUd9N'));
                pinDoc = doc(pinRef, 'rKLcMVwS1fx7Dx8MUd9N');
            } else {
                pinDocSnap = await getDoc(doc(pinRef, '4PGYzq9dtkFOJVdC2J9M'));
                pinDoc = doc(pinRef, '4PGYzq9dtkFOJVdC2J9M');
            }
            const pinCode: PinCode = pinDocSnap.data() as PinCode;
            const isAuthorizedChange = validatePin(oldPin, pinCode.passcode);
            if(isAuthorizedChange) {
                const newPinCode = {
                    passcode: newPin,
                }
                await updateDoc(pinDoc, newPinCode);
            } else throw new Error('Incorrect Passcode...');
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        }
    };
    return {changePin};
};

const validatePin = (oldPin: string, currentPin: string) => {
    try {
        if(oldPin === currentPin)
            return true;
        else
            return false;
    } catch(error: unknown) {
        if(error instanceof Error) console.log(error.message);
    }
};