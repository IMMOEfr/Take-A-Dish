import "../../stylesheets/ShoppingCartStyle.css";
import { useEffect, useState } from "react";
import { auth, menuRef, tableRef } from "../../config/firebase";
import { onSnapshot, query, where } from "firebase/firestore";
import { FoodItem } from "../../hooks/useMenu";
import { FoodComponent } from "../../components/FoodComponent";
import { useNavigate } from "react-router-dom";
import { HOME, MENUROUTE } from "../../lib/routes";
import { useCart } from "../../hooks/useCart";
import { useOrder } from "../../hooks/useOrder";

interface CartProps {
  handleLoadProp: (loadingState: boolean) => void;
}

export interface FoodObj {
  foodObj: FoodItem;
  quantity: number;
}

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
}

export const Cart = ({ handleLoadProp }: CartProps) => {
  const [cartList, setCartList] = useState<FoodObj[]>();
  const [tableData, setTableData] = useState<TableData>();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const { placeOrder } = useOrder();
  const { cancelCart } = useCart();
  const navigate = useNavigate();

  const handleCancel = async () => {
    try {
      handleLoadProp(true);
      if (tableData) await cancelCart(tableData);
    } catch (error: unknown) {
      if (error instanceof Error) console.log(error.message);
    } finally {
      handleLoadProp(false);
      navigate(MENUROUTE);
    }
  };

  const handleOrder = async () => {
    try {
      handleLoadProp(true);
      if (tableData) await placeOrder(tableData, totalPrice);
    } catch (error: unknown) {
      if (error instanceof Error) console.log(error.message);
    } finally {
      handleLoadProp(false);
    }
  };

  useEffect(() => {
    // Grabbng from the Table's
    const userID =
      auth.currentUser?.displayName || localStorage.getItem("userID");
    if (!userID) return;
    const queryRef = query(tableRef, where("tableID", "==", userID));
    const unsubscribe = onSnapshot(queryRef, (snapshot) => {
      let sum: number = 0;
      const tableData = snapshot.docs[0]?.data();
      const temp = snapshot.docs[0]?.data() as TableData;
      if (temp.orders.length > 0) {
        temp.orders.map((order) => {
          sum += order.quantity * order.foodObj.price;
          setTotalPrice(sum);
        });
      } else setTotalPrice(0);
      setCartList(tableData.orders);
      setTableData(temp);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchedUID = localStorage.getItem("userID");
    if (!fetchedUID) navigate(HOME);
  }, []);

  if(totalPrice == 0){
    return (
      <>
      <div className="containerAll">
        <div className="leftSideOfScreen"></div>
        <div className="cart-bold">
          Cart
          <p>Your cart is empty!</p>
        </div>
      </div>
      </>
    )
  }
  else{
  return (
    <>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      ></meta>
      <div className="containerAll">
        <h1 className="cart-bold">Cart</h1>
        <div className="leftSideOfScreen">
          
          <div className="cardContainer">
            {cartList?.map((obj) => {
              return (
                <>
                  <FoodComponent
                    imageURL={obj.foodObj.imageURL}
                    foodName={obj.foodObj.foodName}
                    quantity={obj.quantity}
                    price={obj.foodObj.price}
                  />
                </>
              );
            })}
          </div>
        </div>

        <div className="rightScreen">
          <div className="rightSide" style={{ background: "white" }}>
            <h1 className="payment-summary-text" style={{ color: "black" }}>
              Payment Summary
            </h1>
            <div className="food-info">
              <div>
                {cartList?.map((obj) => {
                  return (
                    <p>
                      <span className="food-name">{obj.foodObj.foodName}</span>
                      <span className="food-quantity">(x{obj.quantity})</span>
                      <span className="food-price">{obj.foodObj.price}PHP</span>
                    </p>
                  );
                })}
              </div>
            </div>
            <div className="food-total">
              <span className="total-text">Total</span>
              <span className="total-digit">{totalPrice} PHP</span>
            </div>
              
          </div>
          <div className="submit-button">
            <button className="cancel-order" onClick={() => handleCancel()}>
                <u className="cancel-word">Cancel Order</u>
            </button>
            {/*delete entire order object*/}
            <button className="place-order" onClick={() => handleOrder()}>
              PLACE ORDER
            </button>
            {/*update order object set isActive to true*/}
          </div>
        </div>
      </div>
    </>
  );
  }
};

{
  /* <section class="selection-grid">

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
  
</div> */
}