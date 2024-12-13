import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, password, email } = req.body;
  console.log("-----body----", req.body);

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      // console.log("-----existingEmail----");

      res.status(400).json({ message: "Email Already Registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    // console.log("-----newUser----", newUser);

    await newUser.save();
    res.status(200).json({ message: "User registered" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // console.log("-----body----", req.body);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid Password" });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "", {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "User Login Succesfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

export const signout = async (req: Request, res: Response) => {
  console.log("--signout---body----");

  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    console.error("Error in Signout:", error);
    res.status(500).json({ message: "Error in Signout" });
  }
};
