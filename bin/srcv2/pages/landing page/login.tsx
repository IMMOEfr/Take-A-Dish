import { useAuth } from "../../hooks/useAuth"
import { useState, useEffect } from "react";
import { auth } from "../../config/firebase";
import { LoginForm } from "../../components/LoginForm";

interface LoginProp {
    handleLoadingProp: (loadState: boolean) => void;
};

export const Login = ({handleLoadingProp}: LoginProp) => {
    return (
        <div>
            <LoginForm handleLoadingProp = {(loadState) => handleLoadingProp(loadState)} />
        </div>
    );
};