import { Login as LoginPopUp} from './login';
import { useDevice } from '../../hooks/useDevice';
import { MENUROUTE } from '../../lib/routes';
import { useState, useEffect } from 'react';
import { logo, loginIcon } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { AdminModal } from '../../components/modals/AdminModal';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { ModalLoginSchema, ModalLoginInput } from '../../lib/validation';
import { LoadingIcon } from '../../components/LoadingIcon';

export const LandingPage = () => {
    const navigate = useNavigate();
    const {unsyncTable} = useDevice();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
    const [isSynced, setIsSynced] = useState<boolean>(false); 
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { register, handleSubmit, formState: { errors } } = useForm<ModalLoginInput>({
        resolver: yupResolver(ModalLoginSchema)
    });

    const navigateToMenu = () => {
        navigate(MENUROUTE);
    };

    const onLandingPage = () => {
        const account = localStorage.getItem('accountType');
        if(!account) return;
        else if (account == 'admin') return;
        const tableID = localStorage.getItem('tableID');
        if(!tableID) return;
        setIsSynced(true);
        setShowModal(showModal);
    }


    const onUnsyncDevice = async () => {
        try{
            setIsLoading(true);
            const tableID = localStorage.getItem("tableID");
            if(!tableID) return;
            await unsyncTable(tableID);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            setIsLoading(false);
            setIsSynced(false);
        }
    }
    useEffect(() => {
        onLandingPage();
    },[showModal]);
    return (
        <div>
            {isLoading && <LoadingIcon loading={isLoading} />}
            {isLoggingIn && (
                <div className='login'>
                    <button className='loginbtn' onClick={() => (setIsLoggingIn(!isLoggingIn))}>x</button>
                    <LoginPopUp handleLoadingProp = {(loadState) => setIsLoading(loadState)}/> {/* LOGIN POPUP*/}
                </div>
            )}
            {isSynced? (
                <div style={{display: 'inline-block'}}>

                    <button className='syncBtn'onClick = {onUnsyncDevice}>Unsync Device</button>
                    <button className='hiddenBtn' onClick={navigateToMenu}></button>
                </div>
                )
                :
                (
                <>
                    <div style={{display: 'inline-block'}}>
                        <button className='syncBtn'onClick = {() => {setShowModal(!showModal); }}>Sync Device</button>
                    </div>
                    <div style={{display: 'inline-block', float: 'right'}}> 
                        {!isLoggingIn && (
                            <img className='loginIcon'
                            src={loginIcon} 
                            onClick={() => (setIsLoggingIn(!isLoggingIn))}/>
                        )}
                    </div>
                </>
                )
            }
             {/* ADMIN MODAL POPUP*/}
            {showModal && ( 
                <AdminModal
                    handleLoadProp = {(loadState) => setIsLoading(loadState)}
                    isSynced = {isSynced}
                    handleSubmit = {handleSubmit}
                    handleExit = {() => {setShowModal(false)}}
                    register = {register} 
                    errors = {errors} 
                />
            )}
            <div className='content'>
            <div style={{
                margin: 'auto',
                maxWidth: '500px',
                paddingTop: '100px',
            }}>
            <img className='logo'src={logo}/>
            {isSynced? (
                <p className= 'clickAnywhere'>
                click anywhere to continue
            </p>
            )
        :
        (
            <p className= 'clickAnywhere'>
                sync to continue
            </p>
        )
        }
            
            </div>
        </div>
        </div>
    );
};