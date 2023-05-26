import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ENDROUTE, HOME } from "../../lib/routes";
import { billsRef } from "../../config/firebase";
import { onSnapshot, query, where } from "firebase/firestore";
import  "../../stylesheets/UserProgressStyle.css";
import { isPreparing, isReady, isReceived, isServed } from "../../assets/assets";
import { truncate } from "fs/promises";

interface ProgressData {
    progressArr: boolean[];
};

export const Status = () => {
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [orderID, setOrderID] = useState<string>('');
    const [updatedProgress, setUpdatedProgress] = useState([true, false, false, false, false]);
    const [progressStepsNum, setProgressStepsNum] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchedUID = localStorage.getItem('userID');
        const fetchedTotalPrice = localStorage.getItem('orderTotalPrice');
        const fetchedOrderID = localStorage.getItem('orderID');
        if(!fetchedUID) navigate(HOME);
        if(fetchedTotalPrice) setTotalPrice(parseInt(fetchedTotalPrice));
        if(fetchedOrderID) setOrderID(fetchedOrderID)
    }, []);

    useEffect(() => {
        const fetchedOrderID = localStorage.getItem('orderID');
        const unsubscribe = onSnapshot(query(billsRef, where('orderID', '==', fetchedOrderID)), (snapshot) => {
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
        const progressSteps = document.querySelectorAll(".userProgress-step");
        if(nextBtns && progress && progressSteps) {
            progressSteps.forEach((progressStep, idx)=>{
                if(idx<progressStepsNum){
                    progressStep.classList.add('userProgress-step-active')
                }
            });
            const progressActive = document.querySelectorAll(".userProgress-step-active");
            progress.style.width = ((progressActive.length - 1)/(progressSteps.length-1))*100+"%";
        }
        updatedProgress.map((booleanExpression) => {
            if(booleanExpression === false)
                needRenavigation = false;
        });
        if(needRenavigation) navigate(ENDROUTE);
    }, [updatedProgress]);

    return (
        <div className="userContainerStatus">
            <div className="userDetails">
                <div className="userOrder">
                    <h1>
                        <b>Order Status</b>
                    </h1>
                </div>
                <div className= 'id'>                
                    <p>Order ID: <span><b>{orderID}</b></span></p>
                    <p><b>Amount: <span>{totalPrice} PHP</span></b></p>
                </div>
            </div>
            <div className="userProgressbar">
                <div className="userProgress" id="progress"></div>
                <div 
                    className="userProgress-step userProgress-step-active"data-title="Order Received">
                        <img className="icon" src={isReceived}/>
                </div>
                <div className="userProgress-step"data-title="Preparing"><img className="icon" src={isPreparing}/></div>
                <div className="userProgress-step"data-title="Cooking"><img className="icon" src={isReady}/></div>
                <div className="userProgress-step"data-title="It's ready"><img className="icon" src={isReady}/></div>
                <div className="userProgress-step"data-title="Served"><img className="icon" src={isServed}/></div>
            </div>
        </div>
    );
};