import {
    cart, burgers, dessert, noodles, 
    beverages, appetizers, soups, all, tablebutton,
} from '../assets/assets';

interface CategoryProps {
    handleChange: (category: string) => void;
};

export const CategorySideBar = ({handleChange}: CategoryProps) => {

    return (
        <section style = {{ float: 'left',}}>
            <div className="container" style = {{
                position: 'relative',
                bottom: '76.5px',
                overflow: 'scroll',
                display: 'inline-block',
                gridTemplateColumns: '1',
                height: '100vh',

            }}>
                <div className="box">
                    <img className= "sideImg" src = {all} onClick={() => (handleChange('all'))} style={{cursor: 'pointer'}}/>
                </div>
                <div className="box">
                    <img className= "sideImg" src = {burgers} onClick={() => (handleChange('burgers'))} style={{cursor: 'pointer'}}/>
                </div>
                <div className="box">
                    <img className= "sideImg" src = {appetizers} onClick={() => (handleChange('appetizers'))} style={{cursor: 'pointer'}}/>
                </div>
                <div className="box">
                    <img className= "sideImg" src = {dessert} onClick={() => (handleChange('desserts'))} style={{cursor: 'pointer'}}/>
                </div>
                <div className="box">
                    <img className= "sideImg" src = {noodles} onClick={() => (handleChange('noodles'))} style={{cursor: 'pointer'}}/>
                </div>
                <div className="box">
                    <img className= "sideImg" src = {beverages} onClick={() => (handleChange('drinks'))} style={{cursor: 'pointer'}}/>
                </div>
                <div className="box">
                    <img className= "sideImg" src = {soups} onClick={() => (handleChange('soups'))} style={{cursor: 'pointer'}}/>
                </div>
            </div>
        </section>
    );
};