import { useEffect, useState, useContext } from "react";
import { FoodItem } from "../../hooks/useMenu";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { menuRef } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { EDITROUTE } from "../../lib/routes";
import { ItemContext } from "../../components/ItemContext";

interface FoodProps {
    food: FoodItem;
    category: string;
    handleDrag: (event: React.DragEvent<HTMLDivElement>) => void;
};

export const Food = ({food, category, handleDrag}: FoodProps) => {
    const itemContext = useContext(ItemContext);
    const [ quantity, setQuantity ] = useState<number>(0);
    const navigate = useNavigate();
    const [ stockState, setStockState ] = useState<string>('');
    const account = localStorage.getItem('accountType');

    const handleEdit = (food: FoodItem) => { //local storage method
        itemContext.setFoodEdit(food);
        navigate(EDITROUTE);
    };

    const handleUpdate = async (foodID: string) => {
        try {
            let isAvailable = false;
            const docRef = doc(menuRef, foodID);
            const snap = await getDoc(docRef);
            const data = snap.data() as FoodItem;

            if(data.isAvailable) isAvailable = false; 
            else isAvailable = true;

            await updateDoc(doc(menuRef, foodID), {isAvailable})
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        }
    };

    useEffect(() => {
        console.log(food.id);
        if(food.isAvailable) setStockState('Available');
        else setStockState('Out of Stock');
    });
    // Conditionally Rendering the Food... Filtered or Non Filtered...
    if(account === 'staff') { // Staff Interface
        if(category === 'all') { // Show All
            return (
                <div className="box-container">
                    <div className="item-container">
                        <img className="menu-img"src = {food.imageURL} onError={(e) => console.log(e)}/>
                        <div className="content">
                            <h3 style={{marginTop:'0', marginBottom:'0',}}>{food.foodName}</h3>
                            <h3 style={{marginTop:'0',}}>{food.price}PHP</h3>
                        </div> 
                        <div>
                            <button onClick = {() => handleUpdate(food.id)}>{stockState}</button>
                        </div>
                    </div>
                </div>
            );
        } else if(food.category === category) { // Show Filtered
            return (
                <div className="box-container">
                    <div className="item-container">
                        <img className="menu-img"src = {food.imageURL} onError={(e) => console.log(e)}/>
                        <div className="content">
                            <h3 style={{marginTop:'0', marginBottom:'0',}}>{food.foodName}</h3>
                            <h3 style={{marginTop:'0',}}>{food.price}PHP</h3>
                        </div> 
                        <div>
                            <button onClick = {() => handleUpdate(food.id)}>{stockState}</button>
                        </div>
                    </div>
                </div>
            );
        } else return <></>;
    } else if (account === 'user') { // User Interface
        if(category === 'all' && food.isAvailable === true) {
            return (
                <div style={{display:'inline-block',}}id= {`${food.id}/${quantity}`} draggable="true" onDragStart={handleDrag}>
                    <div className="box-container">
                        <div className="item-container">
                            <img className="menu-img" src = {food.imageURL} onError={(e) => console.log(e)}/>
                            <div className="content">
                                <h3 style={{marginTop:'0', marginBottom:'0',}}>{food.foodName}</h3>
                                <h3 style={{marginTop:'0',}}>{food.price}PHP</h3>
                            </div>
                            <div>
                                <button className="quantitybtn" onClick = {() => (quantity > 0 && setQuantity(quantity - 1))}>-</button>
                                <button className="quantity">{quantity}</button>
                                <button className="quantitybtn" onClick = {() => (setQuantity(quantity + 1))}>+</button>
                                <p className="quantity-text">quantity</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (food.category === category && food.isAvailable === true) {
            return (
                <div style={{display:'inline-block',}}id = {`${food.id}/${quantity}`} draggable="true" onDragStart={handleDrag}>
                    <div className="box-container">
                    <div className="item-container">
                        <img className="menu-img" src = {food.imageURL} onError={(e) => console.log(e)}/>
                        <div className="content">
                            <h3 style={{marginTop:'0', marginBottom:'0',}}>{food.foodName}</h3>
                            <h3 style={{marginTop:'0',}}>{food.price}PHP</h3>
                        </div>
                        <div>
                            <button className="quantitybtn" onClick = {() => (quantity > 0 && setQuantity(quantity - 1))}>-</button>
                            <button className="quantity">{quantity}</button>
                            <button className="quantitybtn" onClick = {() => (setQuantity(quantity + 1))}>+</button>
                            <p className="quantity-text">quantity</p>
                        </div>
                    </div>
                </div>
            </div>
            );
        } else return <></>
    } else { // Admin Interface
        if(category === 'all') { // Show All
            return (
                <div className="box-container">
                    
                    <div className="item-container">
                        <button className="edit-button" onClick={()=>handleEdit(food)}>&#9998;</button>
                        <img className="menu-img"src = {food.imageURL} onError={(e) => console.log(e)}/>
                        <div className="content">
                            <h3 style={{marginTop:'0', marginBottom:'0',}}>{food.foodName}</h3>
                            <h3 style={{marginTop:'0',}}>{food.price}PHP</h3>
                        </div> 
                        <div>
                            <button onClick = {() => handleUpdate(food.id)}>{stockState}</button>
                        </div>
                    </div>
                </div>
            );
        } else if(food.category === category) { // Show Filtered
            return (
                <div className="box-container">
                    <div className="item-container">
                        <button className="edit-button">&#9998;</button>
                        <img className="menu-img"src = {food.imageURL} onError={(e) => console.log(e)}/>
                        <div className="content">
                            <h3 style={{marginTop:'0', marginBottom:'0',}}>{food.foodName}</h3>
                            <h3 style={{marginTop:'0',}}>{food.price}PHP</h3>
                        </div> 
                        <div>
                            <button onClick = {() => handleUpdate(food.id)}>{stockState}</button>
                        </div>
                    </div>
                </div>
            );
        } else return <></>
    }
};