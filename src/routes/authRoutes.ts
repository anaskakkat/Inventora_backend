import { Router } from "express";
import { register,login } from "../controller/authController";

const authRouter = Router();

// authRouter.post('/signup', register);
authRouter.route("/signup").post(register)
authRouter.route("/login").post(login)

export default authRouter;
