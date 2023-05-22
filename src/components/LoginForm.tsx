import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { LoginSchema, LoginFormInputs } from '../lib/validation';
import { useNavigate } from 'react-router-dom';
import { MENUROUTE } from '../lib/routes';

interface LoginFormProps {
    handleLoadingProp: (loadState: boolean) => void;
};

export const LoginForm = ({handleLoadingProp}: LoginFormProps) => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
        resolver: yupResolver(LoginSchema)
    });
  
    const onSubmit = async (data: LoginFormInputs) => {
        try {
            handleLoadingProp(true);
            await login(data.passcode, data.email);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            handleLoadingProp(false);
            navigate(MENUROUTE);
        }
    };
    
    return (
        <>
            <form style={{backgroundColor: 'white'}}onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input style={{
                        borderRadius: '20px',
                        width: '200px',
                    }}type="email" {...register('email')} />
                    {errors.email && <p style = {{color: 'red'}}>{errors.email.message}</p>}
                    <label htmlFor="password">PIN:</label>
                    <input style={{
                        borderRadius: '20px',
                        width: '200px',
                    }}type="password" {...register('passcode')} />
                    {errors.passcode && <p style = {{color: 'red'}}>{errors.passcode.message}</p>}
                </div>  
                <button style={{
                    backgroundColor: 'rgb(190, 46, 46)', 
                    borderRadius: '20px'
                }} type="submit">Log in</button>
            </form>
        </>
    );
};