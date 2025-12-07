import * as Yup from "yup";

// Existing login schema...
export const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});


export const registerSchema = Yup.object().shape({
  // Change 'username' to 'name'
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"), 
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});