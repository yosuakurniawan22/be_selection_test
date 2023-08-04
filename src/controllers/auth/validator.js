import * as Yup from "yup";

export const UpdateEmployeeValidator = Yup.object({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().required("Password is required").matches(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Password must be at least 8 characters long and include at least 1 uppercase letter, 1 digit number, and 1 special character."
  ),
  fullName: Yup.string().required("Full Name is required"),
  birthdate: Yup.date("Invalid date").required("Birthdate is required")
});

export const LoginValidator = Yup.object({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().required("Password is required")
});

export const CreateEmployeeValidator = Yup.object({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  monthlySalary: Yup.number().required("Monthly Salary is required")
})