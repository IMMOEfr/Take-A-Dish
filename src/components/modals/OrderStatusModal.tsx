import { useEffect, useState } from "react";
import { useOrder } from "../../hooks/useOrder";
import { useWaiter } from "../../hooks/useWaiter";
import { onSnapshot, query, where } from "firebase/firestore";
import { billsRef } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { HOME } from "../../lib/routes";
import  "../../stylesheets/StaffProgressStyle.css";
import { isPreparing, isReady, isReceived, isServed } from "../../assets/assets";

interface OrderStatusModalProps {
    orderID: string;
    totalPrice: number;
    tableID: string;
    handleLoadProp: (loadState: boolean) => void;
    handleExit: (exitState: boolean) => void;
};

interface ProgressData {
    progressArr: boolean[];
};

export const OrderStatusModal = ({orderID, totalPrice, tableID, handleLoadProp, handleExit}: OrderStatusModalProps) => {
    const [updatedProgress, setUpdatedProgress] = useState([false, false, false, false, false]);
    const [progressStepsNum, setProgressStepsNum] = useState<number>(0);

    const {handleRequestedAssistance, handleRequestedBill} = useWaiter();
    const {updateOrderProgress} = useOrder();
    const navigate = useNavigate();


    useEffect(() => {
        const unsubscribe = onSnapshot(query(billsRef, where('orderID', '==', orderID)), (snapshot) => {
            const progressData = snapshot.docs[0]?.data() as ProgressData;
            setUpdatedProgress(progressData.progressArr);
            let localProgressStep = 0;
            progressData.progressArr.map((booleanExpression) => {
                if(booleanExpression === true)
                    localProgressStep += 1;
            });
            setProgressStepsNum(localProgressStep);
        });
        return () => unsubscribe();
    }, [])

    useEffect(() => {
        let needRenavigation = true;
        const nextBtns=document.querySelectorAll(".btn-proceed");
        const progress=document.getElementById("progress");
        const progressSteps = document.querySelectorAll(".progress-step");
        if(nextBtns && progress && progressSteps) {
            progressSteps.forEach((progressStep, idx)=>{
                if(idx<progressStepsNum){
                    progressStep.classList.add('progress-step-active')
                }
            });
            const progressActive = document.querySelectorAll(".progress-step-active");
            progress.style.width = ((progressActive.length - 1)/(progressSteps.length-1))*100+"%";
        }
        updatedProgress.map((booleanExpression) => {
            if(booleanExpression === false)
                needRenavigation = false;
        });
        if(needRenavigation) handleExit(false);
    }, [updatedProgress]);

    useEffect(() => {
        const fetchedUID = localStorage.getItem('userID');
        if(!fetchedUID) navigate(HOME);
    }, []);

    const handleUpdateForOrder = async () => {
        try {
            handleLoadProp(true);
            await updateOrderProgress(orderID, tableID);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            handleLoadProp(false);
        };
    };
    
    return (
        <>
            <div className="orderStatusBackground"onClick = {() => handleExit(false)} ></div>
            <div className="OrderModalContainer">
            {/* Order Status */}
                <div className="containerStatus">
                    <div className="details">
                        <div className='order'>
                            <h1>
                                <b>Order Status</b>
                                </h1>
                            </div>
                                <div className= 'id'>                
                                    <p>Order ID: <span><b>{orderID}</b></span></p>
                                    <p><b>Amount: <span>{totalPrice} PHP</span></b></p>
                                </div>
                            </div>
                            <div className="progressbar">
                                <div className="progress" id="progress"></div>
                                <div 
                                    className="progress-step progress-step-active"data-title="Order Received">
                                        <img className="icon" src={isReceived}/>
                                </div>
                                <div className="progress-step"data-title="Preparing"><img className="icon" src={isPreparing}/></div>
                                <div className="progress-step"data-title="Cooking"><img className="icon" src={isPreparing}/></div>
                                <div className="progress-step"data-title="It's ready"><img className="icon" src={isReady}/></div>
                                <div className="progress-step"data-title="Served"><img className="icon" src={isServed}/></div>
                            </div>
                            <button className="staffBTN-proceed" style={{cursor: 'pointer'}} onClick = {() => handleUpdateForOrder()}>Proceed</button>
                        </div>
            </div>
        </>
    );
};

