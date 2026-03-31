import { User } from "../models/User.js";

export async function requireAuth(req, res, next) {
  const userId = req.headers.userid;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: user not found",
    });
  }

  req.user = { id: userId };
  next();
}