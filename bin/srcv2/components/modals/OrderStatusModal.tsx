import { useEffect, useState } from "react";
import { useOrder } from "../../hooks/useOrder";
import { useWaiter } from "../../hooks/useWaiter";
import { onSnapshot, query, where } from "firebase/firestore";
import { billsRef } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { HOME } from "../../lib/routes";

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
            <div onClick = {() => handleExit(false)} style = {{
                background: 'rgba(1, 9, 23, 0.7)',
                position: 'absolute',
                zIndex: '11',
                height: '100%', 
                width: '100%',
                alignItems: 'center',
                boxSizing: 'border-box',
            }}></div>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                zIndex: '12',
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',      
                borderRadius: '2%',
                width: '300px',
                height: '150px',
                marginLeft: 'auto',
                marginRight: 'auto',
                background: 'white',
                border: 'none',
            }}>
                <div>{/*Order Status*/}
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
                                    <img className="icon" src="/icon/received.png"/>
                            </div>
                            <div className="progress-step"data-title="Preparing"><img className="icon" src="/icon/preparing.png"/></div>
                            <div className="progress-step"data-title="Cooking"><img className="icon" src="/icon/cooking.png"/></div>
                            <div className="progress-step"data-title="It's ready"><img className="icon" src="/icon/ready.png"/></div>
                            <div className="progress-step"data-title="Served"><img className="icon" src="/icon/served.png"/></div>
                        </div>
                    </div>
                    <button className="btn btn-proceed" onClick = {() => handleUpdateForOrder()}>Proceed</button>
                </div>
            </div>
        </>
    );
};

