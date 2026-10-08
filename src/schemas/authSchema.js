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
  // The same rule the server enforces (userValidators.js). The form used to ask
  // for 6 characters of anything, so a password like "abcdef" passed here and
  // then failed on the server with a message the visitor never saw coming.
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "At least 8 characters with an uppercase letter, a lowercase letter, a number and one of @ $ ! % * ? &"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});