import { ModalLoginSchema, ModalLoginInput } from "../../lib/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from 'react-hook-form';
import { AdminMenuModal } from "./AdminMenuModal";
import { useModal } from "../../hooks/useModal";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { HOME } from "../../lib/routes";
import { LoadingIcon } from "../LoadingIcon";

interface AdminModalProps {
    handleLoadProp: (loadState: boolean) => void;
    handleExit: () => void;
    handleSubmit: (onSubmit: (data: ModalLoginInput) => Promise<void>) => React.FormEventHandler<HTMLFormElement>;
    register: any;
    errors: any;
    isSynced: boolean;
};

export const AdminModal = ({handleExit, handleSubmit, register, errors, isSynced, handleLoadProp}: AdminModalProps) => {
    const { modalLogin } = useAuth();
    const [ showModal, setShowModal ] = useState<boolean>(false);
    const { logout } = useAuth();
    const navigate = useNavigate();
    
    const onSubmit = async (data: ModalLoginInput) => {
        try {
            if(isSynced) {
                navigate(HOME);
                handleExit();
            } else {
                handleLoadProp(true)
                console.log(data.passcode)
                const isSuccessful = await modalLogin(data.passcode);
                if(isSuccessful) setShowModal(true); 
            }
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            handleLoadProp(false);
        }
    };

    return (
        <>
            <div className = 'modalWrapper' onClick = {() => handleExit()} style={{
                zIndex: '4',
                position: 'absolute',
                top: '0',
                left: '0',
                bottom: '0',
                right: '0',
                background: 'rgba(0, 0, 0, 0.5)',
            }}></div>
            {(showModal && !isSynced) && (
                <AdminMenuModal handleLoadProp = {(loadingState) => handleLoadProp(loadingState)} handleExit={() => handleExit()}/>
            )}
            {!showModal && (
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
                    paddingLeft: '10px',
                }}>
                    <div className = 'modalItems'>
                        <h3>Admin Access</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <input type="password" placeholder = "Enter Admin Pin..."{...register('passcode')}/>
                            <p style = {{color: 'red'}}>{errors.passcode && errors.passcode.message}</p>
                            <button type="submit">log in</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};