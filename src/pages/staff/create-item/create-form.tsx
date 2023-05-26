import { trash } from "../../../assets/assets";
import { useMenu } from "../../../hooks/useMenu";
import { useForm } from "react-hook-form";
import { CreateFormSchema, CreateItemFormData } from "../../../lib/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { ConfirmCancelModal } from "../../../components/modals/ConfirmCancel";
import "../../../stylesheets/CreateFormStyle.css";
interface CreateFormProps {
    handleLoadProp: (loadState: boolean) => void;
};

export const CreateForm = ({handleLoadProp}: CreateFormProps) => {
    const [isCancelling, setIsCancelling] = useState<boolean>(false);
    const { isLoading, createItem } = useMenu();
    const { register, handleSubmit, formState: {errors}, reset } = useForm<CreateItemFormData>({
        resolver: yupResolver(CreateFormSchema),
    });
    const handleCancel = () => {
        try {
            setIsCancelling(true);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        }
    }
    const onCreateForm = async (dataIN: CreateItemFormData) => {
        try {
            handleLoadProp(true);
            await createItem(dataIN);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            handleLoadProp(false);
            reset();
        }
    };
    useEffect(() => {

    },[isCancelling])
    return(
            <div>
              {isCancelling && (
                <ConfirmCancelModal
                  closeModal={(modalState) => setIsCancelling(modalState)}
                  handleLoadProp={(loadState) => handleLoadProp(loadState)}
                />
              )}
        
              <img
                className="trash"
                src={trash}
                onClick={() => handleCancel()}
                style={{
                  width: "100px",
                  height: "100px",
                  position: "absolute",
                  right: "0",
                  bottom: "0",
                  paddingBottom: "10px",
                }}
              />
        
              <div className="form">
                <form onSubmit={handleSubmit(onCreateForm)}>
                  <h1>Add New Item</h1>
                  <h3 className="form-title">Food Name</h3>
                  <input
                    className="input"
                    placeholder="Enter a name..."
                    {...register("name")}
                  />
                  <p style={{ color: "red" }}> {errors.name?.message}</p>
        
                  <h3 className="form-title">Category</h3>
                  <select className="input" {...register("category")}>
                    <option value="drinks">Drinks</option>
                    <option value="soups">Soups</option>
                    <option value="appetizers">Appetizers</option>
                    <option value="burgers">Burgers</option>
                    <option value="noodles">Noodles</option>
                    <option value="desserts">Desserts</option>
                  </select>
                  <p style={{ color: "red" }}> {errors.category?.message}</p>
                  <h3 className="form-title">Price</h3>
                  <input className="input" placeholder="PHP" {...register("price")} />
                  {/* <p style={{ display: "inline-block" }}>PHP</p> */}
                  <p style={{ color: "red" }}> {errors.price?.message}</p>
                  <label className="imageWord" htmlFor="imageFILE">
                    Image:
                  </label>
                  <input
                    className="chooseFileButton"
                    type="file"
                    id="imageFILE"
                    {...register("imageFILE")}
                  />
                  {errors.imageFILE && (
                    <p style={{ color: "red" }}>{errors.imageFILE.message}</p>
                  )}
                  <input className="submit" type="submit" value="Submit" />
                </form>
              </div>
            </div>
          );
        };
