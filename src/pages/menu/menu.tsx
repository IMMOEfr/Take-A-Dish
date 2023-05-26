import { useNavigate, Link } from 'react-router-dom';
import { onSnapshot, query} from 'firebase/firestore';
import { useState, useEffect} from "react";
import { menuRef, auth } from '../../config/firebase';
import { Food } from './food';
import { FoodItem } from '../../hooks/useMenu';
import { MenuButton } from './menu-button';

import { CategorySideBar } from '../../components/CategorySideBar';
import { HOME } from '../../lib/routes';

interface MenuProps {
    handleLoadProp: (loadState: boolean) => void;
};

export const Menu = ({handleLoadProp}: MenuProps) => {
    const [foodList, setFoodList] = useState<FoodItem[] | null>(null);
    const [menuState, setMenuState] = useState<string>('all');
    const [ isLoggedIn, setIsLoggedIn ] = useState<boolean>(false);
    const navigate = useNavigate();
    const handleDragStart = async (event: React.DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData("menu", event.currentTarget.id);
    };

    const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        const id = event.dataTransfer.getData("menu");
        console.log(id);
    };

    useEffect(() => {
        const q = query(menuRef);
        const unsubscribe = onSnapshot(q, (snap) => {
            const data = snap.docs.map((doc) => ({ ...doc.data() }));
            const foods = data.map((data) => data) as FoodItem[];
            setFoodList(foods);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchedUID = localStorage.getItem('userID');
        if(!fetchedUID) navigate(HOME);
    }, []);

    return( 
        <div>
            {/* <div style= {{position: 'absolute', zIndex: '5000', color: 'red'}}>{menuState && menuState}</div> */}
            <CategorySideBar 
                handleChange={(category) => setMenuState(category)}          
            />
            <div style={{
                overflow: 'scroll',
                overflowX: 'hidden',
                height: '90vh',
            }}>
                <h1 style={{
                position: 'relative',
                // color:'rgb(253, 253, 253)',
                fontSize: '50px',
                fontFamily: 'Poppins',
                textAlign: 'center',
                textTransform: 'uppercase',
                marginTop:'0',
                marginBottom:'0',
                color: '#FFFFFF',
                //textShadow: '0px 3px 3px rgba(255,255,255,0.5)',
                textShadow: '0 -1px 4px #FFF, 0 -2px 10px #ff0, 0 -10px 20px #ff8000, 0 -18px 40px #F00',
             }}>{menuState}</h1>
            {foodList?.map((food) => {
                const consumer = food.consumers.find((consumer) => consumer === auth.currentUser?.displayName);
                if(!consumer) return (
                    <>
                        <Food 
                            food = {food} 
                            category = {menuState}
                            handleDrag = {handleDragStart}
                        />
                    </>
                );
            })}
            </div> 
            <MenuButton />
        </div>
    ) 
};