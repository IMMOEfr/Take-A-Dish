/*
*   HOOKS RELAED TO FOOD
*/
import { storage, menuRef } from "../config/firebase";
import { getDownloadURL, uploadBytes, ref, uploadBytesResumable, deleteObject } from "firebase/storage";
import { setDoc, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HOME } from "../lib/routes";
import { CreateItemFormData} from "../lib/validation";
import { useContext } from "react";
import { ItemContext } from "../components/ItemContext";

interface FoodItem {
    foodName: string;
    price: number;
    category: string;
    imageName: string;
    imageURL: string;
    isAvailable: boolean;
    id: string;
    consumers: string[];
}; export type { FoodItem };

export const useMenu = () => {
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const itemContext = useContext(ItemContext);
    const createItem = async (dataIN: CreateItemFormData) => {
        try {
            setIsLoading(true);
            const imageFile = dataIN.imageFILE[0];
            const storageRef = ref(storage, `foodImages/${imageFile.name}`);
            const snapshot = await uploadBytesResumable(storageRef, imageFile);
            const downloadURL = await getDownloadURL(snapshot.ref);
            const docRef = doc(menuRef);
            const newItem: FoodItem = {
                foodName: dataIN.name,
                price: dataIN.price,
                category: dataIN.category,
                imageName: imageFile.name,
                imageURL: downloadURL,
                isAvailable: true,
                id: docRef.id,
                consumers: []
            };
            await setDoc(docRef, newItem);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const editItem= async (dataIN: CreateItemFormData) => { //needs path to specific document
        try {
            setIsLoading(true);
            // console.log(
            //     `
            //     foodName: ${dataIN.name} != ${itemContext.foodEdit?.foodName} && dataIN.name,
            //     price: ${dataIN.price} != ${itemContext.foodEdit?.price} && dataIN.price,
            //     category: ${dataIN.category} != ${itemContext.foodEdit?.category} && dataIN.category,
                

            //     check:
            //     foodName are equal: ${dataIN.name === itemContext.foodEdit?.foodName? true : false}
            //     price are equal: ${dataIN.price === itemContext.foodEdit?.price? true : false}
            //     category are equal: ${dataIN.category === itemContext.foodEdit?.category? true : false}
            //     `
            // )
            console.log(itemContext);
            // console.log()
            let downloadURL;
            let imageFile;
            const isUpdatingImg = dataIN.imageFILE.length === 1? true : false;
            if(isUpdatingImg) {
                imageFile = dataIN.imageFILE[0];
                const storageRef = ref(storage, `foodImages/${imageFile.name}`);
                const snapshot = await uploadBytesResumable(storageRef, imageFile);
                downloadURL = await getDownloadURL(snapshot.ref);
                await deleteObject(ref(storage, `foodImages/${itemContext.foodEdit?.imageName}`));
            }
            const docRef = doc(menuRef, `${itemContext.foodEdit?.id}`);
            console.log(docRef);
            const updatedItem = {
                foodName: dataIN.name != itemContext.foodEdit?.foodName? dataIN.name : itemContext.foodEdit?.foodName,
                price: dataIN.price != itemContext.foodEdit?.price? dataIN.price : itemContext.foodEdit?.price,
                category: dataIN.category != itemContext.foodEdit?.category? dataIN.category : itemContext.foodEdit?.category,
                imageURL: isUpdatingImg? downloadURL : itemContext.foodEdit?.imageURL,
                imageName: isUpdatingImg? imageFile?.name : itemContext.foodEdit?.imageName,
            };  
            await updateDoc(docRef, updatedItem); 
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    const deleteItem = async () => {
        try {
            const foodDocRef = doc(menuRef, itemContext.foodEdit?.id);
            await deleteDoc(foodDocRef);
            await deleteObject(ref(storage, `foodImages/${itemContext.foodEdit?.imageName}`));
            console.log('Ooga BOoga');
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        }
    };
    return { isLoading, createItem, editItem, deleteItem };
};   