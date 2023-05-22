import { Link } from "react-router-dom";
import { CARTROUTE, TABLEROUTE } from "../../lib/routes";
import { cart, tablebutton } from "../../assets/assets";
import split from "split-string";
import { useCart } from "../../hooks/useCart";
import { useState } from "react";

export const MenuButton = () => {
  const account = localStorage.getItem('accountType');
  const {updateCart} = useCart();
  const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    const id = event.dataTransfer.getData("menu");
    console.log(id);
    try {
      const foodData = id.split('/', 2);
      if(parseInt(foodData[1]) === 0) throw new Error("No 0's");
      await updateCart(foodData[0], parseInt(foodData[1]));
    } catch(error: unknown) {if(error instanceof Error) console.log(error.message)}
  };

  switch (account) {
    case 'user':
      return (
        <div>
          <Link to={CARTROUTE}>
            <div onDragOver={enableDropping} onDrop={handleDrop}>
              <img className='cart'src={cart}/>
            </div>
          </Link>
        </div>
      )
    case 'staff':
      return (
        <div>
          <Link to={TABLEROUTE}>
          <img className='table-button' src={tablebutton}/>
          </Link>
        </div>
      )
    default:
      return null;
  }
};