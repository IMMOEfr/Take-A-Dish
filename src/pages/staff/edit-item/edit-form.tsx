import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMenu } from "../../../hooks/useMenu";
import { trash } from "../../../assets/assets";
import { useForm } from "react-hook-form";
import { EditFoodsSchema, CreateItemFormData } from "../../../lib/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { MENUROUTE } from "../../../lib/routes";
import { ItemContext } from "../../../components/ItemContext";
import { FoodItem } from "../../../hooks/useMenu";
import { ConfirmCancelModal } from "../../../components/modals/ConfirmCancel";
import "../../../stylesheets/EditFormStyle.css";
interface WrapProps {
    functionIN: () => Promise<void>;
}

interface EditFormProps {
    handleLoadProp: (loadingState: boolean) => void;
};

export const EditForm = ({handleLoadProp}: EditFormProps) => {
    const [isCancelling, setIsCancelling] = useState<boolean>(false);
    const itemContext = useContext(ItemContext);
    const navigate = useNavigate();
    const {editItem, deleteItem} = useMenu();
    const [name, setName] = useState<string>(itemContext.foodEdit?.foodName? itemContext.foodEdit?.foodName : '');
    const [price, setPrice] = useState<number>(itemContext.foodEdit?.price?  itemContext.foodEdit?.price : 0);
    const [category, setCategory] = useState<string>(itemContext.foodEdit?.category? itemContext.foodEdit?.category : '');

    const {register, handleSubmit, formState: {errors}, reset} = useForm<CreateItemFormData>({
        resolver: yupResolver(EditFoodsSchema)
    });
    const handleCancel = () => {
        try {
            handleLoadProp(true);
            setIsCancelling(true);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally{
            handleLoadProp(false);
        }
    }
    const wrapFunction = async ({functionIN}: WrapProps ) => {
        try {
            await functionIN();
            navigate(MENUROUTE);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        }
    }

    const onSubmit = async (updatedData: CreateItemFormData) => {
        try {
            handleLoadProp(true);
            await editItem(updatedData);;
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally {
            handleLoadProp(false);
            navigate(MENUROUTE)
        }
    };

    useEffect(()=>{

    },[isCancelling]);
    useEffect(() => {
        if(itemContext.foodEdit) {
            localStorage.setItem('localContext', JSON.stringify(itemContext));
        } else {
            const localItemContext = localStorage.getItem('localContext');
            if(localItemContext) {
                itemContext.setFoodEdit(JSON.parse(localItemContext).foodEdit);
                setName(JSON.parse(localItemContext).foodEdit.foodName);
                setPrice(JSON.parse(localItemContext).foodEdit.price);
                setCategory(JSON.parse(localItemContext).foodEdit.category);
            }
        }
    },[]);

    return (
        <>
        <div className="body">
        {isCancelling && (
            <ConfirmCancelModal
            closeModal={(modalState) => setIsCancelling(modalState)}
            handleLoadProp={(loadState) => handleLoadProp(loadState)}
        />
        )}
        <div className="leftGrid">
            <div className="namePrice">
            <h3 className="leftGridWord">Name</h3>
            <input
            className="inputBox"
            type="text"
            value={name ? name : ""}
            {...register("name")}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (
            <p className="error" style={{ color: "red" }}>
              {errors.name.message}
            </p>
          )}
          <h3 className="leftGridWord">Price</h3>
          <input
            className="inputBox"
            type="tel"
            value={price ? price : 0}
            {...register("price")}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
          />

          {errors.price && (
            <p className="error" style={{ color: "red" }}>
              {errors.price.message}
            </p>
          )}
        </div>

        <div className="category">
          <h3 className="leftGridWord">Category: {category}</h3>
          <select className="inputBox" {...register("category")}>
            <option value={`${itemContext.foodEdit?.category}`}>
              Select Category
            </option>
            <option value="Drinks">Drinks</option>
            <option value="Soups">Soups</option>
            <option value="Appetizers">Appetizers</option>
            <option value="Burgers">Burgers</option>
            <option value="Noodles & pasta">Noodles</option>
            <option value="Desserts">Desserts</option>
          </select>
          {errors.category && (
            <p style={{ color: "red" }}>{errors.category.message}</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="rightGrid">
            <img
              className="photo"
              height="120px"
              width="120px"
              src={itemContext.foodEdit?.imageURL}
            />
            <div className="replaceImage">
              <div>
                <label htmlFor="imageFILE">Replace Image</label>
              </div>
              <div className="chooseFile">
                <input
                  className="chooseFileButton"
                  type="file"
                  id="imageFILE"
                  {...register("imageFILE")}
                />
                {errors.imageFILE && (
                  <p style={{ color: "red" }}>{errors.imageFILE.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="deleteUpdate">
            <button
              className="delete"
              onClick={() => wrapFunction({ functionIN: deleteItem })}
            >
              Delete Item
            </button>
            <input className="update" type="submit" value="Update Item" />
          </div>
        </div>
      </form>
    </div>
    </>
    );
};