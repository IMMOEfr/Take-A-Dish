import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ENDROUTE, HOME } from "../../lib/routes";
import { isPreparing } from "../../assets/assets";
import { billsRef } from "../../config/firebase";
import { onSnapshot, query, where } from "firebase/firestore";
import  "../../stylesheets/ProgressStyle.css";

interface ProgressData {
    progressArr: boolean[];
};

export const Status = () => {
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [orderID, setOrderID] = useState<string>('');
    const [updatedProgress, setUpdatedProgress] = useState([false, false, false, false, false]);
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
        if(needRenavigation) navigate(ENDROUTE);
    }, [updatedProgress]);

    return (
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
    );
};