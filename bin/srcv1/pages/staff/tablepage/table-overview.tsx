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

interface TableProps {
    handleLoadProp: (loadingState: boolean) => void;
}
export const TableOverview = ({handleLoadProp}: TableProps) => {
    const [isLoading, setIsLoading]= useState<boolean>(false);
    const [tables, setTables] = useState<tableData[] | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [toBeManagedTableID, setToBeManagedTableID] = useState<string>('');


    useEffect(() => {
        const q = query(tableRef, orderBy("tableNumber"));
        const unsubscribe = onSnapshot(q, (snap) => {
            const data = snap.docs.map((doc) => ({ ...doc.data() }));
            const tablesArr = data.map((data) => data) as tableData[];
            setTables(tablesArr);
        });
        return () => unsubscribe();
    }, [isLoading]);
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

