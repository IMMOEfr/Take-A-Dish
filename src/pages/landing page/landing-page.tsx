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
import { onAuthStateChanged } from 'firebase/auth';
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
        auth.onAuthStateChanged(user => {
            if (user?.email != 'admin@gmail.com' && (user?.email)) {
              setIsSynced(true);
              setShowModal(showModal);
            };
        })
    }
    function errorMessage(){
        alert("This device is not in sync. Please contact staff for assistance.");
    };

    const onUnsyncDevice = () => {
        onAuthStateChanged(auth, (user) => {
            if(user && user.email != null && user.displayName != null){
                const id = user.displayName;
                unsyncTable(id);
                console.log("successfully unsynced");  
            }
        });
        setIsSynced(false);
    }
    useEffect(() => {

        onLandingPage();
    },[]);
    return (
        <div>
            {isLoading && <LoadingIcon loading={isLoading} />}
            {isLoggingIn && (
                <div className='login'>
                    <button onClick={() => (setIsLoggingIn(!isLoggingIn))}>x</button>
                    <LoginPopUp handleLoadingProp = {(loadState) => setIsLoading(loadState)}/> {/* LOGIN POPUP*/}
                </div>
            )}
            {isSynced? (
                <>
                    <button onClick = {onUnsyncDevice}>Unsync Device</button>
                    <button className='hiddenBtn' onClick={navigateToMenu}></button>
                </>
                )
                :
                (
                <>
                    <div>
                        <button onClick = {() => {setShowModal(!showModal); }}>Sync Device</button>
                    </div>
                    <div> 
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
            <p className= 'clickAnywhere'>
                click anywhere to continue
            </p>
            </div>
        </div>
        </div>
    );
};