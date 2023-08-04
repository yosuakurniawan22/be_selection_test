import Users from "../../models/users.model.js";
import { LoginValidator } from "./validator.js";
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

export default { login }