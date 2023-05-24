import { tableData } from "../../../hooks/useTable";
import { useTable } from "../../../hooks/useTable";
import { tableRef } from "../../../config/firebase";
import { adminTable, inactiveTable, syncedTable, tableNotif } from "../../../assets/assets";
import { useEffect, useState } from "react";
import { LoadingIcon } from "../../../components/LoadingIcon";
import { onSnapshot, orderBy, query, where } from "firebase/firestore";
import { StaffHandleAssisstanceMdal } from "../../../components/modals/StaffHandleAssisstanceModal";

// import Table
interface TableProps{
    table: tableData;
    handleLoadProp: (loadingState: boolean) => void;
    setShowModal: (modalState: boolean) => void;
    setTableID: (tableID: string) => void;
}

export const Tables = ({table, handleLoadProp, setShowModal, setTableID}: TableProps) => {
    const [tables, setTables] = useState<tableData[] | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const { deleteTable } = useTable();
    const account = localStorage.getItem('accountType');
    useEffect(() => {
        const q = query(tableRef, orderBy("tableNumber"));
        const unsubscribe = onSnapshot(q, (snap) => {
            const data = snap.docs.map((doc) => ({ ...doc.data() }));
            const tablesArr = data.map((data) => data) as tableData[];
            setTables(tablesArr);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async(tableID: string) => {
        try {
            handleLoadProp(true);
            await deleteTable(tableID);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            handleLoadProp(false);
        }
    };

    const handleRequest = async(tableID: string) => {
        setShowModal(true);
        setTableID(tableID);
    };

    useEffect(() => {   
        console.log(`Admin: ${isAdmin}`);
    }, [isAdmin]);
    if(account === 'admin'){
        return (
            <>
                <div className="box-container">
                <div className="table-container">
                    <h3>{table.tableNumber}</h3>
                    {table.isActive? (
                        <img height='80px' width='120px' src={syncedTable}/>
                    )
                    :
                    (
                        <img height='80px' width='120px' src={inactiveTable}/>
                    )}

                    <button onClick = {() => handleDelete(table.tableID)}>Delete</button>
                </div>
                </div>
            </>
        );
    } else {
        return(
            <>
                <div className="box-container">
                    <div className="table-container">
                        <h3>{table.tableNumber}</h3>
                        {table.isActive? (
                            <>
                                {(table.isRequestingAssistance || table.isRequestingBill)? (table.isRequestingAssistance, 
                                    <img height='80px' width='120px'src={tableNotif} onClick = {() => handleRequest(table.tableID)}/>
                                )
                                :
                                (
                                    <img height='80px' width='120px' src={syncedTable} onClick = {() => {handleRequest(table.tableID)}}/>
                                )}
                            </>
                        )
                        :
                        (
                            <img height='80px' width='120px' src={inactiveTable}/>   
                        )}
                    </div>
                </div>
            </>
        );
    };
};