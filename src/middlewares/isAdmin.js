import Users from "../models/users.model.js";

export async function isAdmin(req, res, next) {
  try {
    const userId = req.id;

    const user = await Users.findOne({
      where: { id: userId }
    });

    if(user.roleId !== 1) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized Access!",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized. Invalid token",
    });
  }
}