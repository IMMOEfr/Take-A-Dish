import { Link } from "react-router-dom";
import { CARTROUTE, STATUSROUTE, CREATEROUTE, TABLEROUTE, HOME, PASSWORDROUTE, STAFFTABLEROUTE } from "../lib/routes";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { onSnapshot, query, where } from "firebase/firestore";
import { tableRef } from "../config/firebase";

export const NavbarRender = () => {
const { logout } = useAuth();
const [isActive, setIsActive] = useState<boolean>(false);

const handleSignout = async() => {
    try  {
        await logout(HOME);
    } catch(error: unknown) {
        if(error instanceof Error) console.log(error.message);
    }
};
const account = localStorage.getItem('accountType');
useEffect(() => {
  try {
    if(account == 'user'){
      const tableID = localStorage.getItem('userID');

      const unsubscribe = onSnapshot(query(tableRef, where('tableID', '==', tableID)), (snapshot) => {
          const tableData = snapshot.docs[0].data();
          setIsActive(tableData.isActive);

      });
      return () => unsubscribe();
    }
  } catch(error: unknown) {
      if(error instanceof Error) console.log(error.message);
  }
  
}, []);
  switch (account) {
    case 'user':
      return (
        <>
          <Link to={CARTROUTE} className="navText">Cart</Link>
          {isActive && (
            <Link to={STATUSROUTE} className="navText">Status</Link>
          )}
        </>
      )
    case 'staff':
      return (
        <>
          <Link to = {STAFFTABLEROUTE} className="navText"> Table Overview </Link> {/*change to appropriate page later*/}
          <button style = {buttonStyle} onClick={handleSignout}>Sign Out</button>
        </>
      )
    case 'admin':
      return (
        <>
          <Link to = {CREATEROUTE} className="navText"> Add Item </Link>
          <Link to = {TABLEROUTE} className="navText"> Table Manager </Link>
          <Link to = {PASSWORDROUTE} className="navText">Password Reset</Link>
          <button style = {buttonStyle} onClick={handleSignout}>Sign Out</button>
        </>
      )
    default:
      return null;
  }
}
const buttonStyle = {
    background: 'transparent',
    padding: 'none',
    marginTop: '11px',
    height: '0px',
    border: 'none',
    cursor: 'pointer',
};