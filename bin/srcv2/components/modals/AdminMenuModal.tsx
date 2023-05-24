import { useState, useEffect } from 'react';
import { 
    adminTable, key, sync,
} from '../../assets/assets';
import { SyncForm } from '../sync-form/SyncForm';
import { LoadingIcon } from '../LoadingIcon';

export interface AdminProps{
    handleExit: () => void;
    handleLoadProp: (loadState: boolean) => void;
}
export const AdminMenuModal = ({handleExit, handleLoadProp}: AdminProps) => {
    const [modalContentType, setModalContentType] = useState<string>('sync');

    return (
        <>
            <div className = 'modal' style = {{
                zIndex: '5',
                background: 'white',
                position: 'fixed',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%,-50%)',
                borderRadius: '5px',
                height: '30%',
                width: '50%',
            }}>
                <div>
                
                    <div className ="side-container">
                        <img  className="side-modal" src = {sync} alt = 'sync'/>
                    </div>
                    
                </div>
                <ModalContent 
                    handleLoadProp = {(loadState) => handleLoadProp(loadState)}
                    type = {modalContentType}
                    handleExit = {() => handleExit()}
                />
            </div>
        </>
        
    );
};
interface ModalContent {
    type: string;
    handleExit: () => void;
    handleLoadProp: (loadState: boolean) => void;
};

const ModalContent = ({type, handleExit, handleLoadProp}: ModalContent) => {
    return (
        <>
            {type === 'sync' && (
                <SyncForm handleLoadProp = {(loadState) => handleLoadProp(loadState)} handleExit={() => handleExit()}/>
            )}
  
        </>
    )
}; 