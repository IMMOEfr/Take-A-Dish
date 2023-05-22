import { Link } from 'react-router-dom';
import { CARTROUTE, MENUROUTE, CREATEROUTE, HOME, STATUSROUTE, TABLEROUTE } from '../lib/routes';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import { NavbarRender } from './navbar-render';
import { 
    logo 
} from '../assets/assets';

export const Navbar = () => {
    return (
        <div>
            <header className="navbar">
                <img src= {logo} style={{
                    width: '60px',
                    height: '50px',
                    float: 'left',
                    paddingRight: '10px',
                }}/>
                <Link to={MENUROUTE} className="navText"> Menu </Link>
                <NavbarRender/>
            </header>
        </div>
    );
}
