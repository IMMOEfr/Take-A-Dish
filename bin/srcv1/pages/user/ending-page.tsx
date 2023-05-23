import { useNavigate } from "react-router-dom";
import { back, logo } from "../../assets/assets"
import { MENUROUTE } from "../../lib/routes";
import { useEffect, useState } from "react";
import { onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { auth, tableRef } from "../../config/firebase";
import { useWaiter } from "../../hooks/useWaiter";
import { PleaseWaitModal } from "../../components/modals/PleaseWaitModal";

export const EndingPage = () => {
    const [isRequestingBill, setIsRequestingBill] = useState<boolean>(false); 
    const [isRequestingAssistance, setIsRequestingAssistance] = useState<boolean>(false);
    const [tableID, setTableID] = useState<string>('');
    const {handleRequestedAssistance, handleRequestedBill} = useWaiter(); 
    const navigate = useNavigate();

    const handleRequestBill = async () => {
        try {
             await handleRequestedBill(tableID);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        }
    };

    const handleRequestingAssistance = async () => {
        try {
            await handleRequestedAssistance(tableID);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        }
    };
    
    useEffect(() => {
        const userID = localStorage.getItem('userID');
        if(!userID) return;
        setTableID(userID);
        const unsubscribe = onSnapshot(query(tableRef, where('tableID', '==', auth.currentUser?.displayName)), (snapshot) => {
            const tableData = snapshot.docs[0].data();
            setIsRequestingBill(tableData.isRequestingBill);
            setIsRequestingAssistance(tableData.isRequestingAssistance);
        });
        return () => unsubscribe();
    }, []);

    return (
        <>
            {(isRequestingAssistance || isRequestingBill) && (<PleaseWaitModal />)}
            <div>
                <img className='endLogo'src={logo}/>
                <div style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'block',
                    }}>
                    <h1 style={{textAlign: 'center'}}>Please enjoy your meal!</h1>
                </div>
                <div style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <button onClick = {() => handleRequestingAssistance()}>Call A Waiter</button>
                    <button onClick = {() => handleRequestBill()}>Request Bill</button>
                </div>
            </div>
            <div>
                <img style={{
                    height: '65px',
                    zIndex: '10',
                    width: '100px',
                    position: 'fixed',
                    bottom: '0',
                    paddingBottom: '10px',
                    display: 'inline-block',
                    cursor: 'pointer',
                }} src={back} onClick={ () => navigate(MENUROUTE)}/>
                <p style= {{
                    display: 'inline-block',
                    position: 'fixed',
                    bottom: '0',
                    paddingBottom: '10px',
                    paddingLeft: '90px',
                    }}>Back to menu
                </p>
            </div>
        </>
    );
};