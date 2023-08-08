import jwt from "jsonwebtoken";
import Users from "../models/users.model.js";

export async function checkExpiredToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized. Invalid token",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized. No token provided",
      });
    }

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: 401,
          message: "Unauthorized. Invalid token",
        });
      }

      const user = await Users.findOne({
        where: { id: decoded.id }
      });

      if(!user) {
        return res.status(404).json({
          status: 404,
          message: "User Not Found",
        });
      }

      if(user.joindate) {
        return res.status(401).json({
          status: 401,
          message: "Link Expired",
        });
      }
      
      req.id = decoded.id;
      next();
    });
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized. Invalid token",
    });
  }
}