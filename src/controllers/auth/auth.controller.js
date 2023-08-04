import db from "../../database/index.js";
import sendEmail from "../../helper/sendEmail.js";
import Salaries from "../../models/salaries.model.js";
import Users from "../../models/users.model.js";
import { CreateEmployeeValidator, LoginValidator } from "./validator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    await LoginValidator.validate(req.body);

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

    await CreateEmployeeValidator.validate(req.body);

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

export default { login, createEmployee }