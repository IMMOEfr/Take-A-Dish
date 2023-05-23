import { EditForm } from "./edit-form";

interface EditItemProps{
    handleLoadProp: (loadingState: boolean) => void;
}
export const EditItem = ({handleLoadProp}: EditItemProps) => {
    return (    
    <div>
       <EditForm handleLoadProp = {(loadingState)=> handleLoadProp(loadingState)}/>
    </div>
    );
};