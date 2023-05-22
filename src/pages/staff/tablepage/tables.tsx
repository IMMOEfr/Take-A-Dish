import { tableData } from "../../../hooks/useTable";
import { useTable } from "../../../hooks/useTable";
import { tableRef } from "../../../config/firebase";
import { adminTable, inactiveTable, syncedTable } from "../../../assets/assets";
import { useEffect, useState } from "react";
import { LoadingIcon } from "../../../components/LoadingIcon";

// import Table
interface TableProps{
    table: tableData;
    handleLoadProp: (loadingState: boolean) => void;
}

export const Tables = ({table, handleLoadProp}: TableProps) => {
    const [tables, setTables] = useState<tableData[] | null>(null);
    const { fetchTables, deleteTable } = useTable();

    const handleFetch = async () => {
        try {
            const tablesArr = await fetchTables() as tableData[];
            setTables(tablesArr);
        } catch(error: unknown) {if(error instanceof Error ) console.log(error.message);}
    };
    useEffect(() => {
        handleFetch();
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
};