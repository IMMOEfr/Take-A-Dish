import { useState } from "react";

export const useModal = () => {
    const [showModal, setShowModal] = useState();
    const setModal = (modalIn: JSX.Element) => {
        try {

        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        }
    };
    return {showModal, setModal}
}