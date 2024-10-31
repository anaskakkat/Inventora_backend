import { Router } from "express";
import { register, login, signout } from "../controller/authController";

const authRouter = Router();

// authRouter.post('/signup', register);
authRouter.route("/signup").post(register);
authRouter.route("/login").post(login);
authRouter.route("/signout").post(signout);

export default authRouter;
