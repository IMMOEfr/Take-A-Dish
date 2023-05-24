import { burgers } from "../../assets/assets";
import { useEffect, useState } from 'react';
import { auth, menuRef, tableRef } from "../../config/firebase";
import { onSnapshot, query, where } from "firebase/firestore";
import { FoodItem } from "../../hooks/useMenu";
import { FoodComponent } from "../../components/FoodComponent";
import { useNavigate } from "react-router-dom";
import { HOME, MENUROUTE, STATUSROUTE } from "../../lib/routes";
import { useCart } from "../../hooks/useCart";
import { useOrder } from "../../hooks/useOrder";

interface CartProps {
    handleLoadProp: (loadingState: boolean) => void;
}

export interface FoodObj {
    foodObj: FoodItem;
    quantity: number;
};

export interface TableData {
    orderSnap: FoodObj;
    displayName: string;
    email: string;
    isActive: boolean;
    isSynced: boolean;
    password: string;
    orders: FoodObj[];
    tableID: string;
    tableNumber: number;
    uid: string;
};

export const Cart = ({handleLoadProp}: CartProps) => {
    const [cartList, setCartList] = useState<FoodObj[]>();
    const [tableData, setTableData] = useState<TableData>();
    const [updatedFoodItems, setUpdatedFoodItems] = useState<FoodObj[]>();
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const {placeOrder} = useOrder();
    const { cancelCart } = useCart();
    const navigate = useNavigate();

    const handleCancel = async () => {
        try {
            handleLoadProp(true);
            if(tableData) await cancelCart(tableData);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            handleLoadProp(false);
            navigate(MENUROUTE);
        }
    };

    const handleOrder = async () => {
        try {
            handleLoadProp(true);
            if(tableData) await placeOrder(tableData, totalPrice);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            handleLoadProp(false);
        }
    };

    useEffect(() => { // Grabbng from the Table's
        const userID = auth.currentUser?.displayName || localStorage.getItem('userID');
        if(!userID) return;
        const queryRef = query(tableRef, where('tableID', '==', userID));
        const unsubscribe = onSnapshot(queryRef, (snapshot) => {
            let sum: number = 0;
            const tableData = snapshot.docs[0]?.data();
            const temp = snapshot.docs[0]?.data() as TableData;
            if(temp.orders.length > 0) {
                temp.orders.map((order) => {
                    sum += order.quantity * order.foodObj.price
                    setTotalPrice(sum);
                });
            } else setTotalPrice(0);
            setCartList(tableData.orders);
            setTableData(temp);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if(!cartList) return;
        cartList.map((obj) => {
            const unsubscribe = onSnapshot(query(menuRef, where('id', '==', obj.foodObj.id)), (snapshot) => {
                const updatedAvailableData = snapshot.docs[0].data();
                let bufferAvailableFoods: FoodObj[] = [];
                if(updatedAvailableData.isAvailable === true) {
                    bufferAvailableFoods.push(updatedAvailableData as FoodObj);
                }
                setUpdatedFoodItems(bufferAvailableFoods);
            });
            return () => unsubscribe();
        });
    }, []);

    useEffect(() => {
        const fetchedUID = localStorage.getItem('userID');
        if(!fetchedUID) navigate(HOME);
    }, []);

    return (
        <>
            <div className = 'leftSideOfScreen'>
                <div className = 'cardContainer'>
                    {cartList?.map((obj) => {
                        // obj.foodObj.isAvailable
                        
                        return (
                            <>
                                <FoodComponent 
                                    imageURL = {obj.foodObj.imageURL}
                                    foodName = {obj.foodObj.foodName}
                                    quantity= {obj.quantity}
                                    price = {obj.foodObj.price}
                                />
                            </>
                        )
                    })}
                </div>
            </div>


            <div className = 'rightSide' style={{background: 'white'}}>
                <h1 style = {{color: 'black'}}>Payment Summary</h1>
                <div className = 'paymentSuummary Container'>
                    <div>
                        {cartList?.map((obj) => {
                            if(obj.foodObj.isAvailable) return (
                                <p>
                                    <span>{obj.foodObj.foodName}</span>
                                    <span>x{obj.quantity}</span>
                                    <span>{obj.foodObj.price}</span>
                                </p>
                            )
                        })}
                    </div>
                    <div>
                        <h1>Total Price</h1>
                        <p>{totalPrice} PHP</p>
                    </div>
                </div>
            </div>
            <div className = 'submit-button'>
                <button onClick = {()=> handleCancel()}>cancel order</button> {/*delete entire order object*/}
                <button onClick = {() => handleOrder()}>PLACE ORDER</button> {/*update order object set isActive to true*/}
            </div>
        </>
    );
}

{/* <section class="selection-grid">

<div class="selection">

  <div class="left-side">
    <div class="food-details">
      <img class="food-icon" src="food-icons/sandwich.png">
      <div class="food-display-info">
        <p>Food name 1</p>
        <p>PHP 100</p>
      </div>
    </div>
  </div>
  <div class="right-side">
    <div class="plus-minus">
    <button class="minus">-</button>
    <div class="quantity">2</div>
    <button class="plus">+</button>
    </div>
  </div>
  
</div> */}