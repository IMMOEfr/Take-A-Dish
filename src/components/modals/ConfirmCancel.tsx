import { useNavigate } from "react-router-dom";
import { MENUROUTE } from "../../lib/routes";


interface ConfirmCancelProps{
    handleLoadProp: (loadState: boolean) => void;
    closeModal: (modalState: boolean) => void;
};

export const ConfirmCancelModal = ({handleLoadProp, closeModal}: ConfirmCancelProps) => {
    const navigate = useNavigate();
    const handleCancel = () => {
        try {
            handleLoadProp(true);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            handleLoadProp(false);
            navigate(MENUROUTE);
        }
    };
    return(
        <>
            <div style = {{
                background: 'rgba(1, 9, 23, 0.7)',
                position: 'absolute',
                zIndex: '11',
                height: '100%', 
                width: '100%',
                alignItems: 'center',
                boxSizing: 'border-box',
            }}></div>
            <div style={{
                position: 'absolute',
                top: '50%',
                zIndex: '12',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',      
                borderRadius: '2%',
                width: '300px',
                height: '150px',
                marginLeft: 'auto',
                marginRight: 'auto',
                background: 'white',
                border: 'none',
            }}>
                <p>
                    Scrap changes?
                    All information will be lost
                </p>
                <button onClick = {() => closeModal(false)}>NO</button>
                <button onClick= {() => handleCancel()}>YES</button>
            </div>
            
        </>
    );
};