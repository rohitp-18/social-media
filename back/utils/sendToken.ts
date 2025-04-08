import { Response } from "express";
import jwt from "jsonwebtoken";

const sendToken = (res: Response, user: any) => {
  let secret: any = process.env.JWT_SECRET;
  let expire: any = process.env.JWT_EXPIRE;
  const token = jwt.sign({ _id: user._id }, secret, {
    expiresIn: expire * 24 * 60 * 60 * 1000,
  });

  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: false,
      expires: new Date(Date.now() + expire * 24 * 60 * 60 * 1000),
    })
    .json({
      success: true,
      token,
      user,
    });
};

export default sendToken;
