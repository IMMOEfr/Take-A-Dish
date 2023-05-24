import { CreateForm } from "./create-form";

interface CreateItemProps {
    handleLoadProp: (loadState: boolean) => void;
};

export const CreateItem = ({handleLoadProp}: CreateItemProps) => {
    return (
        <div>
            <CreateForm handleLoadProp = {(loadState) => handleLoadProp(loadState)}/>
        </div>
    );
};