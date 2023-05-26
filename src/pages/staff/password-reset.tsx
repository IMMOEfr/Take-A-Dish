import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChangePassCodeSchema, PasswordFormInput } from '../../lib/validation';
import { usePin } from '../../hooks/usePin';
import { MENUROUTE } from '../../lib/routes';
import { useNavigate } from 'react-router-dom';

interface PasswordFormProps{
    handleLoadProp: (loadingState: boolean) => void;
}
export const PasswordReset = ({handleLoadProp}: PasswordFormProps) => {
    const navigate = useNavigate();
    const {changePin} = usePin();
    const { register, handleSubmit, formState: {errors}, reset } = useForm<PasswordFormInput>({
        resolver: yupResolver(ChangePassCodeSchema)
    });
    
    const tryChangePassword = async (formData: PasswordFormInput) => {
        try {
            handleLoadProp(true);
            // Goiung to try and do shit
            await changePin(formData.oldPin, formData.newPin, formData.accountType);
            // console.log(formData);
        } catch(error: unknown) {
            if(error instanceof Error) console.log(error.message);
        } finally{
            handleLoadProp(false);
        }
    };
    
    return (
        <>
          <div>
            <form className="form" onSubmit={handleSubmit(tryChangePassword)}>
              <h1>Reset Password</h1>
              <select className="input" {...register("accountType")}>
                <option style={{ display: "none" }}>Select Account</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
              {errors.accountType && (
                <p style={{ color: "red" }}>{errors.accountType.message}</p>
              )}
    
              <input
                className="input"
                type="password"
                placeholder="Enter Current Password.."
                {...register("oldPin")}
              />
              {errors.oldPin && (
                <p style={{ color: "red" }}>{errors.oldPin.message}</p>
              )}
    
              <input
                className="input"
                type="password"
                placeholder="Enter New Password.."
                {...register("newPin")}
              />
              {errors.newPin && (
                <p style={{ color: "red" }}>{errors.newPin.message}</p>
              )}
    
              <input
                className="input"
                type="password"
                placeholder="Re-enter New Password.."
                {...register("confirmNewPin")}
              />
              {errors.confirmNewPin && (
                <p style={{ color: "red" }}>{errors.confirmNewPin.message}</p>
              )}
              <input className="input" type="submit" value="Change Pin" />
              <input
                className="input"
                type="button"
                onClick={() => navigate(MENUROUTE)}
                value="Cancel Changes"
              />
            </form>
          </div>
        </>
      );
    };