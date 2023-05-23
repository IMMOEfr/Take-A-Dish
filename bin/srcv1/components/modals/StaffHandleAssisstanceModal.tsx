import { onSnapshot, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { tableRef, placedOrderRef } from "../../config/firebase";
import { checkMark, deny } from "../../assets/assets";
import { useWaiter } from "../../hooks/useWaiter";
import { FoodItem } from "../../hooks/useMenu";
import { PlacedOrder, useOrder } from "../../hooks/useOrder";
import { OverviewComponent } from "../OverviewComponent";

interface StaffHandleAssisstanceModalProps {
    tableID: string;
    closeModal: (modalState: boolean) => void;
    handleLoadProp: (loadState: boolean) => void;
};

interface FoodObj {
    foodObj: FoodItem;
    quantity: number;
    rank: number;
};
export const StaffHandleAssisstanceMdal = ({tableID, closeModal, handleLoadProp}: StaffHandleAssisstanceModalProps) => {
    const [isRequestingBill, setIsRequestingBill] = useState<boolean>(false);
    const [isRequestingAssistance, setIsRequestingAssistance] = useState<boolean>(false);
    const [isOrdering, setIsOrdering] = useState<boolean>(false);
    const [viewingOrder, setViewingOrder] = useState<boolean>(false);
    const [tableNumber, setTableNumber] = useState<number>(0);
    const [orderID, setOrderID] = useState<string>('');
    const [permissionToCloseModal, setPermissionToCloseModal] = useState<boolean>(false);
    const [orderList, setOrderList] = useState<FoodObj[]>();
    const [totalPrice, setTotalPrice] = useState<number>();
    const {updateOrderProgress} = useOrder();
    const {handleRequestedAssistance, handleRequestedBill} = useWaiter();

    const handleUpdateForOrder = async () => {
        try {
            handleLoadProp(true)
            await updateOrderProgress(orderID, tableID);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            handleLoadProp(false)
        }
    };

    const confirmAssistance = async () => {
        try {
            await handleRequestedAssistance(tableID);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            closeModal(false);
        }
    };

    const confirmBill = async () => {
        try {
            await handleRequestedBill(tableID);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            closeModal(false);
        }
    };

    useEffect(() => {
        const unsubscribe = onSnapshot(query(tableRef, where('tableID', '==', tableID)), (snapshot) => {
            const tableData = snapshot.docs[0].data();
            setIsRequestingBill(tableData.isRequestingBill);
            setIsRequestingAssistance(tableData.isRequestingAssistance);
            setIsOrdering(tableData.isOrdering);
            setTableNumber(tableData.tableNumber);
            setOrderID(tableData.orderID);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(query(placedOrderRef, where('id', '==', tableID)), (snapshot) => {
            const tableOrdersData = snapshot.docs[0].data() as PlacedOrder;
            let orders: FoodObj[] = [];
            let localPrice = 0;
            tableOrdersData.orders.map((order) => {
                orders.push(order);
                localPrice += (order.foodObj.price * order.quantity);
            });
            setTotalPrice(localPrice);
            setOrderList(orders);
        });
        return () => unsubscribe();
    }, []);
  
    return (
        <>
            <div aria-disabled = {true} onClick = {() => {
                if(viewingOrder) {setViewingOrder(false); setPermissionToCloseModal(true);}
                else if(permissionToCloseModal) closeModal(false);
            }} style = {{
                background: 'rgba(1, 9, 23, 0.7)',
                position: 'absolute',
                zIndex: '11',
                height: '100%', 
                width: '100%',
                alignItems: 'center',
                boxSizing: 'border-box',
            }}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
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

                    <h1>Table {tableNumber} Overview</h1>
                    {/*Showing the Orders*/}
                    {!viewingOrder? (
                        <>
                            <p>Order Details</p>
                            {orderList?.map((obj) => {
                                return (
                                    <>
                                        <OverviewComponent 
                                            foodName = {obj.foodObj.foodName}
                                            quantity= {obj.quantity}
                                            price = {obj.foodObj.price}
                                        />
                                    </>
                                )
                            })}
                            <p>Total {totalPrice}PHP</p>
                            {/*Proceed to order*/}
                            {isOrdering && (
                                <div>
                                    <p>Proceed to order...</p>  
                                    <img style = {{zIndex: '20'}}height='50px' width='50px' src={checkMark} onClick = {() => {setViewingOrder(true); setPermissionToCloseModal(false);}}/>
                                </div>
                            )}
                        </>

                    )
                    :
                    (
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
                    )
                }




















                    {/*Request Assistance*/}
                    {isRequestingAssistance && ( 
                        <div>
                            <p>Requesting for assistance...</p>
                            <img height='50px' width='50px' src={checkMark}/>
                        </div>
                    )}
                    {isRequestingBill && (
                        <> {/*Bill Management*/}
                            <div>     
                                <p>Requesting for bill...</p><img height='50px' width='50px' src={checkMark} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};