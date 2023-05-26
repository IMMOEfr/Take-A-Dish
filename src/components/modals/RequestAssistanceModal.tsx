import { checkMark } from "../../assets/assets"
import { useWaiter } from "../../hooks/useWaiter";
import "../..//stylesheets/TableOverviewStyle.css"
interface RequestAssistanceModalProps{
    tableID: string;
    handleLoadProp: (loadState: boolean) => void;
    handleExit: (loadState: boolean) => void;
    handleCloseModal: (loadState: boolean) => void;
}

export const RequestAssistanceModal = ({tableID, handleLoadProp, handleExit, handleCloseModal}: RequestAssistanceModalProps) => {

    const {handleRequestedAssistance} = useWaiter();
    const confirmAssistance = async () => {
        try {
            handleLoadProp(true);
            await handleRequestedAssistance(tableID);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            handleLoadProp(false);
            handleExit(false);
            handleCloseModal(false);
        };
    };

    return(
        <div>
            <p className="requestAssistance">Requesting for assistance...</p>
            <img className="checkbtn" src={checkMark} onClick = {() => confirmAssistance()}/>
         </div>
    );
};

