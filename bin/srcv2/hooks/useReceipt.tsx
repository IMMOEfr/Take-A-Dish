import { BLANK_PDF, Template, generate } from '@pdfme/generator';
import { Designer } from "@pdfme/ui";
import { billsRef, placedOrderRef, storage, tableRef } from '../config/firebase';
import { doc, getDoc, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { template } from '../lib/pdf';
import { FoodObj } from '../pages/user/cart';
import { PlacedOrder } from './useOrder';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
// npm install qrcode.react

interface BillData {
    orderID: string
};

export const useReceipt = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const inputs = [{
        ITEM1: '', ITEM2: '', ITEM3: '', ITEM4: '', ITEM5: '', 
        ITEM6: '', ITEM7: '', ITEM8: '', ITEM9: '', ITEM10: '',
        SL1: '', SL2: '', SL3: '', SL4: '', SL5: '', SL6: '',
        SL7: '', SL8: '', SL9: '', SL10: '', PRICE1: '', 
        PRICE2: '', PRICE3: '', PRICE4: '',  PRICE5: '',  PRICE6: '',
        PRICE7: '',  PRICE8: '',  PRICE9: '',  PRICE10: '',  TOT1: '', 
        TOT2: '',  TOT3: '',  TOT4: '',  TOT5: '',  TOT6: '',
        TOT7: '',  TOT8: '', TOT9: '',  TOT10: '',  QTY1: '', 
        QTY2: '',  QTY3: '',  QTY4: '',  QTY5: '', QTY6: '', QTY7: '', 
        QTY8: '', QTY9: '', QTY10: '', ORDERID: '', TOTALPRICE: '',
    }];
    const generatePDF = async (tableID: string, placedOrders: FoodObj[], orderID: string) => {
        try {
            setIsLoading(true); 
            let totalPrice = 0;
            for(let i = 0; i < placedOrders.length; i++) {
                if(i === 0) {
                    inputs[0].ITEM1 = placedOrders[i].foodObj.foodName;
                    inputs[0].QTY1 = '' + placedOrders[i].quantity;
                    inputs[0].PRICE1 = '' + placedOrders[i].foodObj.price;
                    inputs[0].TOT1 = (placedOrders[i].foodObj.price * placedOrders[i].quantity).toLocaleString() + ' PHP';
                    inputs[0].SL1 = '' + (i + 1);
                } else if(i === 1) {
                    inputs[0].ITEM2 = placedOrders[i].foodObj.foodName;
                    inputs[0].QTY2 = '' + placedOrders[i].quantity;
                    inputs[0].PRICE2 = '' + placedOrders[i].foodObj.price;
                    inputs[0].TOT2 = '' + (placedOrders[i].foodObj.price  * placedOrders[i].quantity).toLocaleString() + ' PHP';
                    inputs[0].SL2 = '' + (i + 1);
                } else if(i === 2) {
                    inputs[0].ITEM3 = placedOrders[i].foodObj.foodName;
                    inputs[0].QTY3 = '' + placedOrders[i].quantity;
                    inputs[0].PRICE3 = '' + placedOrders[i].foodObj.price;
                    inputs[0].TOT3 = (placedOrders[i].foodObj.price  * placedOrders[i].quantity).toLocaleString() + ' PHP';
                    inputs[0].SL3 = '' + (i + 1);
                } else if(i === 3) {
                    inputs[0].ITEM4 = placedOrders[i].foodObj.foodName;
                    inputs[0].QTY4 = '' + placedOrders[i].quantity;
                    inputs[0].PRICE4 = '' + placedOrders[i].foodObj.price;
                    inputs[0].TOT4 = (placedOrders[i].foodObj.price  * placedOrders[i].quantity).toLocaleString() + ' PHP';
                    inputs[0].SL4 = '' + (i + 1);
                } else if(i === 4) {
                    inputs[0].ITEM5 = placedOrders[i].foodObj.foodName;
                    inputs[0].QTY5 = '' + placedOrders[i].quantity;
                    inputs[0].PRICE5 = '' + placedOrders[i].foodObj.price;
                    inputs[0].TOT5 = (placedOrders[i].foodObj.price * placedOrders[i].quantity).toLocaleString() + ' PHP';
                    inputs[0].SL5 = '' + (i + 1);
                } else if(i === 5) {
                    inputs[0].ITEM6 = placedOrders[i].foodObj.foodName;
                    inputs[0].QTY6 = '' + placedOrders[i].quantity;
                    inputs[0].PRICE6 = '' + placedOrders[i].foodObj.price;
                    inputs[0].TOT6 = (placedOrders[i].foodObj.price * placedOrders[i].quantity).toLocaleString() + ' PHP';
                    inputs[0].SL6 = '' + (i + 1);
                } else if(i === 6) {
                    inputs[0].ITEM7 = placedOrders[i].foodObj.foodName;
                    inputs[0].QTY7 = '' + placedOrders[i].quantity;
                    inputs[0].PRICE7 = '' + placedOrders[i].foodObj.price;
                    inputs[0].TOT7 = (placedOrders[i].foodObj.price  * placedOrders[i].quantity).toLocaleString() + ' PHP';
                    inputs[0].SL7 = '' + (i + 1);
                } else if(i === 7) {
                    inputs[0].ITEM8 = placedOrders[i].foodObj.foodName;
                    inputs[0].QTY8 = '' + placedOrders[i].quantity;
                    inputs[0].PRICE8 = '' + placedOrders[i].foodObj.price;
                    inputs[0].TOT8 = (placedOrders[i].foodObj.price  * placedOrders[i].quantity).toLocaleString() + ' PHP';
                    inputs[0].SL8 = '' + (i + 1);
                } else if(i === 8) {
                    inputs[0].ITEM9 = placedOrders[i].foodObj.foodName;
                    inputs[0].QTY9 = '' + placedOrders[i].quantity;
                    inputs[0].PRICE9 = '' + placedOrders[i].foodObj.price;
                    inputs[0].TOT9 = + (placedOrders[i].foodObj.price  * placedOrders[i].quantity).toLocaleString() + ' PHP';
                    inputs[0].SL9 = '' + (i + 1);
                } else if(i >= 9) {
                    inputs[0].ITEM10 = '...';
                    inputs[0].QTY10 = '...';
                    inputs[0].PRICE10 = '...';
                    inputs[0].TOT10 = '...';
                    inputs[0].SL10 = '' + (i + 1);
                }
                totalPrice += placedOrders[i].foodObj.price  * placedOrders[i].quantity;
            };
            inputs[0].TOTALPRICE = `TOTAL: ${totalPrice.toLocaleString()} PHP`;
            inputs[0].ORDERID = `ORDER ID\n${orderID}`;
            const pdf = await generate({ template , inputs });
            const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
            window.open(URL.createObjectURL(blob));
            const date = new Date()
            const storageRef = ref(storage, `bills/${orderID}/${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`);
            const snapshot = await uploadBytesResumable(storageRef, blob);
            const downloadURL = await getDownloadURL(snapshot.ref);
            const billsDocRef = doc(billsRef, orderID);
            const billsDocSnap = await getDoc(billsDocRef);
            const billsData = billsDocSnap.data() as BillData;
            await setDoc(billsDocRef, {
                orderID: billsData.orderID,
                pdfURL: downloadURL,
            });
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    return { generatePDF, isLoading};
};