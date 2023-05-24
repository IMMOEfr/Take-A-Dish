import { Link } from "react-router-dom";
import { CARTROUTE, STATUSROUTE, CREATEROUTE, TABLEROUTE, HOME, PASSWORDROUTE, STAFFTABLEROUTE } from "../lib/routes";
import { useAuth } from "../hooks/useAuth";

export const NavbarRender = () => {
const { logout } = useAuth();


const handleSignout = async() => {
    try  {
        await logout(HOME);
    } catch(error: unknown) {
        if(error instanceof Error) console.log(error.message);
    }
};
const account = localStorage.getItem('accountType');
  switch (account) {
    case 'user':
      return (
        <>
          <Link to={CARTROUTE} className="navText">Cart</Link>
          <Link to={STATUSROUTE} className="navText">Status</Link>
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