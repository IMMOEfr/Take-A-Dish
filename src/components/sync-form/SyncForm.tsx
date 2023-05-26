
import { useEffect, useState } from 'react';
import { FoodItem } from '../../hooks/useMenu';
import { useTable } from '../../hooks/useTable';
import { unsyncedTable, syncedTable } from '../../assets/assets';
import { useDevice } from '../../hooks/useDevice';
import { query, orderBy, onSnapshot } from 'firebase/firestore';
import { tableData } from '../../hooks/useTable';
import { tableRef } from '../../config/firebase';
import { AdminProps } from '../modals/AdminMenuModal';
import { HOME } from '../../lib/routes';
import { useNavigate } from 'react-router-dom';
import { LoadingIcon } from '../LoadingIcon';

interface Order {
    foodItems: FoodItem[];
};

export const SyncForm = ({handleExit, handleLoadProp}: AdminProps) => {
    const navigate = useNavigate();
    const { syncTable } = useDevice();
    const [tables, setTables] = useState<tableData[] | null>(null);
    
    const toSync = async (ID: string) => {
        if(localStorage.getItem('request')) {
            try {
                handleLoadProp(true);
                await syncTable(ID);
            } catch(error: unknown) {
                if(error instanceof Error) console.log(error.message);
            } finally {
                setTimeout(async ()=> {
                    handleLoadProp(false);
                    handleExit();
                },5000);
            }
        } else {
            alert('Please try again in a few seconds.');
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
    }, []);
    return (
        <>
            <div className="box-container">
                {tables && tables.map((table) => {
                    return (
                        <>
                            {table.isSynced &&    
                            <div className="modal-container">
                                <p>{table.tableNumber}</p>
                                <img className="modal-img" src={syncedTable} />
                            </div>

                        } 
                            {!table.isSynced && 
                            <div className="modal-container" onClick={() => toSync(table.tableID)}>
                                <p>{table.tableNumber}</p>
                                <img className="modal-img" src={unsyncedTable}/>
                            </div>

                        }
                        </>
                    );
                })}
                {!tables && <div><p>There are no Tables</p></div>}
            </div>
        </>
    );
};