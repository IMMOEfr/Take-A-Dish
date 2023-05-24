import { useTable } from "../../../hooks/useTable";
import { Tables } from "./tables";
import { tableData } from "../../../hooks/useTable";
import { useState, useEffect } from "react";
import { tableRef } from "../../../config/firebase";
import { getCountFromServer, query, onSnapshot, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { TABLEROUTE } from "../../../lib/routes";
import { LoadingIcon } from "../../../components/LoadingIcon";
import { StaffHandleAssisstanceMdal } from "../../../components/modals/StaffHandleAssisstanceModal";
import { useWaiter } from "../../../hooks/useWaiter";

interface TableProps {
    handleLoadProp: (loadingState: boolean) => void;
}
export const TableOverview = ({handleLoadProp}: TableProps) => {
    const [isLoading, setIsLoading]= useState<boolean>(false);
    const [tables, setTables] = useState<tableData[] | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [toBeManagedTableID, setToBeManagedTableID] = useState<string>('');
    const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
    const {handlePayment, handleRequestedBill} = useWaiter();

    const checkout = async () => {
        try {
            handleLoadProp(true);
            const tableID = localStorage.getItem('deletingTable');
            if(!tableID) return;
            await handlePayment(tableID);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            handleLoadProp(false);
            localStorage.removeItem('deletingTable');
        }
    }

    useEffect(() => {
        const q = query(tableRef, orderBy("tableNumber"));
        checkout();
        try {
            const unsubscribe = onSnapshot(q, (snap) => {
                const data = snap.docs.map((doc) => ({ ...doc.data() }));
                const tablesArr = data.map((data) => data) as tableData[];
                setTables(tablesArr);
            });
            return () => unsubscribe();
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        }
    }, [isLoading, showModal]);
    return (
        <>
            {showModal && <StaffHandleAssisstanceMdal tableID = {toBeManagedTableID} closeModal = {(modalState) => setShowModal(modalState)} handleLoadProp = {(loadState) => handleLoadProp(loadState)}/>}
            <div>
                {tables?.map((table) =>(
                    <Tables setTableID = {(tableID) => {setToBeManagedTableID(tableID)}} setShowModal = {(modalState) => setShowModal(modalState)} handleLoadProp = {(loadState) => handleLoadProp(loadState)} table={table}/>
                ))}
            </div>
        </>
    );
};

