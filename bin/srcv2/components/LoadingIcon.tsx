import { PuffLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { logo } from "../assets/assets";

interface LoadingIconProps {
    loading: boolean;
};

export const LoadingIcon = ({loading}: LoadingIconProps) => {
    return (
        <div className="Logo-Screen">
            <>
                <PuffLoader
                    color={'white'}
                    loading={loading}
                    size={250}
                />
                <img className="take-a-dish-logo" src={logo} />
            </> 
        </div>
    );
};