import * as yup from "yup";
/*
*   CREATE FORM VALIDATION
*/

interface CreateItemFormData {
    name: string;
    category: string;
    price: number;
    imageFILE: FileList;
}; export type { CreateItemFormData };

export const CreateFormSchema = yup.object().shape({
    name: yup.string().required("Needs a name."),
    category: yup.string().required("Needs a category"),
    price: yup.number().positive().required("Needs a price."),
    imageFILE: yup
    .mixed()
    .required('Image is Required')
    .test(
        'fileSize',
        'The file is too large or has not been uploaded.',
        function (value) {
            if (!value) {
                return true;
            };
            return (value as FileList)[0]?.size <= 2000000;
        }
    ),
});

/*
*   LOGIN FORM VALIDATION
*/

interface LoginFormInputs {
    email: string;
    passcode: string;
}; export type { LoginFormInputs };
  
export const LoginSchema = yup.object().shape({
    email: yup.string().required('Email is required'),
    passcode: yup.string().required('Pin is Required'),
});

interface ModalLoginInput {
    passcode: string;
}; export type { ModalLoginInput };
  
export const ModalLoginSchema = yup.object().shape({
    passcode: yup.string().required('Pin is Required'),
});

/*
*   EDIT FORM VALIDATION
*/

export const EditFoodsSchema = yup.object().shape({
    name: yup.string(),
    category: yup.string(),
    price: yup.number().positive(),
    imageFILE: yup.mixed()
});

/*
*   PASSWORD UPDATE VALIDATION
*/
interface PasswordFormInput {
    oldPin: string;
    newPin: string;
    confirmNewPin: string;
    accountType: string;
}; export type { PasswordFormInput };

export const ChangePassCodeSchema = yup.object().shape({
    oldPin: yup.string().required("Enter current password"),
    newPin: yup.string().required("Enter new password"),
    confirmNewPin: yup.string().required().oneOf([yup.ref('newPin')], "Pins must match"),
    accountType: yup.string().required('Please select an account type').oneOf(['admin', 'staff'], 'Please select a valid account type.'),
});