import { useNavigate } from "react-router-dom";
import { back, logo } from "../../assets/assets"
import { HOME, MENUROUTE } from "../../lib/routes";
import { useEffect, useState } from "react";
import { onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { auth, tableRef } from "../../config/firebase";
import { useWaiter } from "../../hooks/useWaiter";
import { PleaseWaitModal } from "../../components/modals/PleaseWaitModal";
import "../../stylesheets/EndingPageStyle.css"

export const EndingPage = () => {
    const [isRequestingBill, setIsRequestingBill] = useState<boolean>(false); 
    const [isRequestingAssistance, setIsRequestingAssistance] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [tableID, setTableID] = useState<string>('');
    const [orderID, setOrderID] = useState<string>('');
    const {handleRequestedAssistance, handleRequestedBill} = useWaiter();
    const [hasRequestedBill, setHasRequestedBill] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleRequestBill = async () => {
        try {
            setHasRequestedBill(true);
            await handleRequestedBill(tableID);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        }
    };

    const handleRequestingAssistance = async () => {
        try {
            setIsRequestingAssistance(true);
            console.log(tableID);
            await handleRequestedAssistance(tableID);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        }
    };
    
    useEffect(() => {
        const fetchTableID = auth.currentUser?.displayName || localStorage.getItem('userID');
        if(fetchTableID)setTableID(fetchTableID);
        else return;
        console.log(isRequestingAssistance);
        console.log(isRequestingBill);
        const unsubscribe = onSnapshot(query(tableRef, where('tableID', '==', `${fetchTableID}`)), (snapshot) => {
            if(!(snapshot.docs[0].exists())) return;
            const tableData = snapshot.docs[0]?.data();
            setIsRequestingBill(tableData.isRequestingBill);
            setIsRequestingAssistance(tableData.isRequestingAssistance);
            setIsActive(tableData.isActive);
            setOrderID(tableData.orderID);
            console.log(isActive);
        if(!(tableData.isActive)) {
            localStorage.removeItem('orderID');
            localStorage.removeItem('orderTotalPrice');
            navigate(HOME);
        }
        });
        return () => unsubscribe();
    }, [hasRequestedBill, isRequestingBill, isActive]);

    return (
        <>
            {(isRequestingAssistance || isRequestingBill) && (<PleaseWaitModal />)}
            <div>
                <img className='endLogo'src={logo}/>
                <div>
                    <h1 className = "endingH1">Please enjoy your meal!</h1>
                </div>
                <div>
                    <button className="callWaiterBTN" onClick = {() => handleRequestingAssistance()}>Call A Waiter</button>
                    <button className="RequestBillBTN" onClick = {() => handleRequestBill()}>Request Bill</button>
                </div>
            </div>
            <div>
                <img className="endingLogo"src={back} onClick={ () => navigate(MENUROUTE)}/>
                <p className="backMenuBTN">Back to menu</p>
            </div>
        </>
    );
};