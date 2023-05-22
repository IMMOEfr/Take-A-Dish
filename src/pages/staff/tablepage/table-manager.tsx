import { useTable } from "../../../hooks/useTable";
import { Tables } from "./tables";
import { tableData } from "../../../hooks/useTable";
import { useState, useEffect } from "react";
import { tableRef } from "../../../config/firebase";
import { getCountFromServer, query, onSnapshot, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { TABLEROUTE } from "../../../lib/routes";
import { LoadingIcon } from "../../../components/LoadingIcon";

interface TableProps {
    handleLoadProp: (loadingState: boolean) => void;
}
export const TableManager = ({handleLoadProp}: TableProps) => {
    const {createTable} = useTable();
    const [tables, setTables] = useState<tableData[] | null>(null);
    const { fetchTables } = useTable();
    const [isLoading, setIsLoading]= useState<boolean>(false);
    const navigate = useNavigate();
    const handleClick = async() => {
        try {
            handleLoadProp(true);
            const snapshot = await getCountFromServer(tableRef);
            const tableNumber = snapshot.data().count;
            await createTable(tableNumber+1);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally{
            handleLoadProp(false);
        }
    };

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
            {isLoading && <LoadingIcon loading = {isLoading}/>}
            <div>
                <button className="add-table" onClick={handleClick}>+</button>
                {tables?.map((table) =>(
                    <Tables handleLoadProp = {(loadState) => handleLoadProp(loadState)} table={table}/>
                ))}
            </div>
        </>
    );
};

