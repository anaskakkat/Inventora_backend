import { Router } from "express";
import {
  createSale,
  dashboardData,
  fetchSales,
} from "../controller/saleController";
import { authenticateUser } from "../middleware/authenticateUser ";

const saleRouter = Router();

saleRouter
  .route("/")
  .post(authenticateUser, createSale)
  .get(authenticateUser, fetchSales);
saleRouter.route("/").post(createSale).get(fetchSales);
saleRouter.route("/dashboard").get(authenticateUser, dashboardData);

export default saleRouter;
