import { OAuth2Client } from "google-auth-library";
import { User } from "../models/User.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function googleLogin(req, res) {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: "Token required" });
  }

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const {
    sub: googleId,
    name,
    email,
    picture, 
  } = payload;

  // find or create user
  let user = await User.findOne({ googleId });

  if (!user) {
    user = await User.create({
      googleId,
      name,
      email,
      avatar: picture,
    });
  }

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });
}
