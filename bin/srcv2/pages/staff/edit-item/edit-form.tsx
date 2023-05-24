import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMenu } from "../../../hooks/useMenu";
import { trash } from "../../../assets/assets";
import { useForm } from "react-hook-form";
import { EditFoodsSchema, CreateItemFormData } from "../../../lib/validation";
import { yupResolver } from "@hookform/resolvers/yup";

import { MENUROUTE } from "../../../lib/routes";
import { ItemContext } from "../../../components/ItemContext";
import { FoodItem } from "../../../hooks/useMenu";

interface WrapProps {
    functionIN: () => Promise<void>;
}

interface EditFormProps {
    handleLoadProp: (loadingState: boolean) => void;
};

export const EditForm = ({handleLoadProp}: EditFormProps) => {
    const itemContext = useContext(ItemContext);
    const navigate = useNavigate();
    const {editItem, deleteItem} = useMenu();
    const [name, setName] = useState<string>(itemContext.foodEdit?.foodName? itemContext.foodEdit?.foodName : '');
    const [price, setPrice] = useState<number>(itemContext.foodEdit?.price?  itemContext.foodEdit?.price : 0);
    const [category, setCategory] = useState<string>(itemContext.foodEdit?.category? itemContext.foodEdit?.category : '');

    const {register, handleSubmit, formState: {errors}, reset} = useForm<CreateItemFormData>({
        resolver: yupResolver(EditFoodsSchema)
    });

    const wrapFunction = async ({functionIN}: WrapProps ) => {
        try {
            await functionIN();
            navigate(MENUROUTE);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        }
    }

    const onSubmit = async (updatedData: CreateItemFormData) => {
        try {
            handleLoadProp(true);
            await editItem(updatedData);;
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            handleLoadProp(false);
            navigate(MENUROUTE)
        }
    };

    useEffect(() => {
        if(itemContext.foodEdit) {
            localStorage.setItem('localContext', JSON.stringify(itemContext));
        } else {
            const localItemContext = localStorage.getItem('localContext');
            if(localItemContext) {
                itemContext.setFoodEdit(JSON.parse(localItemContext).foodEdit);
                setName(JSON.parse(localItemContext).foodEdit.foodName);
                setPrice(JSON.parse(localItemContext).foodEdit.price);
                setCategory(JSON.parse(localItemContext).foodEdit.category);
            }
        }
    },[]);
    
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <img height='120px' width='120px' src={itemContext.foodEdit?.imageURL}/>

                    <h3>Name: </h3>   
                    <input 
                        type="text" 
                        value ={name? name : ''}
                        {...register("name")}
                        onChange = {(e) => setName(e.target.value)}
                    />
                    {errors.name && <p style = {{color: 'red'}}>{errors.name.message}</p>}

                    <h3>Price</h3>
                    <input 
                        type="number" 
                        value={price? price : 0} {...register("price")}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                    />PHP
                    {errors.price && <p style = {{color: 'red'}}>{errors.price.message}</p>}

                    <h3>Category: {category}</h3>
                    <select {...register("category")}>
                        <option value={`${itemContext.foodEdit?.category}`}>Select Category</option>
                        <option value='drinks'>Drinks</option>
                        <option value="soups">Soups</option>
                        <option value="appetizers">Appetizers</option>
                        <option value="burgers">Burgers</option>
                        <option value="noodles & pasta">Noodles</option>
                        <option value="desserts">Desserts</option>
                    </select>
                    {errors.category && <p style = {{color: 'red'}}>{errors.category.message}</p>}
                    
                    <label htmlFor="imageFILE">Replace Image:</label>
                    <input type="file" id="imageFILE" {...register('imageFILE')} />
                    {errors.imageFILE && <p style = {{color: 'red'}}>{errors.imageFILE.message}</p>}
                    <button onClick = {() => wrapFunction({functionIN: deleteItem})}>Delete Item</button>
                    <button onClick ={() => navigate(MENUROUTE)}>Cancel Changes</button>                    
                    <input type="submit" value="Update Item"/>
                </div>
            </form>
        </>
    );
};