import { trash } from "../../../assets/assets";
import { useMenu } from "../../../hooks/useMenu";
import { useForm } from "react-hook-form";
import { CreateFormSchema, CreateItemFormData } from "../../../lib/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import { MENUROUTE } from "../../../lib/routes";

interface CreateFormProps {
    handleLoadProp: (loadState: boolean) => void;
};

export const CreateForm = ({handleLoadProp}: CreateFormProps) => {
    const { isLoading, createItem } = useMenu();
    const { register, handleSubmit, formState: {errors}, reset } = useForm<CreateItemFormData>({
        resolver: yupResolver(CreateFormSchema),
    });

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

    return(
        <div>
            <Link to={MENUROUTE}>
            <img src={trash}style={{
                width: '50px',
                height: '50px',
                position: 'absolute',
                right: '0',
                bottom: '0',
                paddingBottom: '10px',
            }}/>
            </Link>
        <div className="form">
            <form onSubmit={handleSubmit(onCreateForm)}>
                <h1>Add A New Item</h1>
                <h3 className="form-title">Food Name</h3>
                <input 
                    className="input"
                    placeholder="Enter a name..."
                    {...register("name")}
                />
                <p style = {{color: 'red'}}> {errors.name?.message}</p>

                <h3 className="form-title">Category</h3>
                <select {...register("category")}>
                    <option value="drinks">Drinks</option>
                    <option value="soups">Soups</option>
                    <option value="appetizers">Appetizers</option>
                    <option value="burgers">Burgers</option>
                    <option value="noodles & pasta">Noodles</option>
                    <option value="desserts">Desserts</option>
                </select> 
                <p style = {{color: 'red'}}> {errors.category?.message}</p>
                <h3 className="form-title">Price</h3>
                <input 
                    className="input"
                    placeholder="Price..."
                    {...register("price")}
                />
                <p style={{ display: "inline-block",}}>PHP</p>
                <p style = {{color: 'red'}}> {errors.price?.message}</p>
                <label htmlFor="imageFILE">Image:</label>
                <input type="file" id="imageFILE" {...register('imageFILE')} />
                {errors.imageFILE && <p style = {{color: 'red'}}>{errors.imageFILE.message}</p>}
                <input type="submit" value="Submit"/>
            </form>
        </div>
        </div>
    );
};
