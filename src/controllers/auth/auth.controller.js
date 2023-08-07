import db from "../../database/index.js";
import sendEmail from "../../helper/sendEmail.js";
import Salaries from "../../models/salaries.model.js";
import Users from "../../models/users.model.js";
import { CreateEmployeeValidator, LoginValidator, UpdateAccountValidator } from "./validator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    try {
      await LoginValidator.validate(req.body);
    } catch (validationError) {
      return res.status(400).json({
        status: 400,
        message: validationError.message
      });
    }

    const user = await Users.findOne({
      where: { email }
    });

    if(!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
      return res.status(401).json({
        status: 401,
        message: "Invalid password",
      });
    }

    const token = jwt.sign({
      id: user.id,
      email: user.email,
    }, process.env.SECRET_KEY, { expiresIn: '2h'});

    return res.status(200).json({ 
      status: 200,
      message: 'Login success',
      data: user,
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Error while processing your request"
    })
  }
}

const createEmployee = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { email, monthlySalary, FE_URL } = req.body;

    try {
      await CreateEmployeeValidator.validate(req.body);
    } catch (validationError) {
      return res.status(400).json({
        status: 400,
        message: validationError.message
      });
    }

    const userExist = await Users.findOne({
      where: { email }
    });

    if(userExist) {
      return res.status(400).json({
        status: 400,
        message: 'User already exists'
      })
    }

    const user = await Users.create({
      email,
      roleId: 2,
    }, { transaction: transaction });

    await Salaries.create({
      userId: user.id,
      salary: monthlySalary
    }, { transaction: transaction });

    const token = jwt.sign({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt
    }, process.env.SECRET_KEY, { expiresIn: '3h'});

    const emailSent = await sendEmail(
      email,
      "Create Account",
      `<html>
        <body>
          <p>Please click this button to complete your account data</p>
          <p><a href="${FE_URL}/${token}" target="_blank" style="display: inline-block; background-color: black; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px;">Complete Data</a></p>
          <p>Thank you!</p>
        </body>
      </html>`
    );

    if(!emailSent) {
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }

    await transaction.commit();

    return res.status(200).json({
      status: 200,
      message: "Email sent. Create Employee Success!",
    });
  } catch (error) {
    await transaction.rollback();

    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Error while processing your request"
    });
  }
}

const updateAccount = async (req, res) => {
  try {
    const { fullName, birthdate, password, confirmPassword } = req.body;

    try {
      await UpdateAccountValidator.validate(req.body);
    } catch (validationError) {
      return res.status(400).json({
        status: 400,
        message: validationError.message
      });
    }

    const userId = req.id;

    const user = await Users.findOne({
      where: { id: 6}
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User Not Found"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 400,
        message: "Passwords do not match"
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

    user.fullName = fullName;
    user.birthdate = birthdate;
    user.password = hashPassword;
    user.joindate = formattedDate;
    user.updatedAt = currentDate;

    await user.save();

    return res.status(200).json({
      status: 200,
      message: "Account updated successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Error while processing your request"
    });
  }
}

export default { login, createEmployee, updateAccount }