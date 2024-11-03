import { Router } from "express";
import { createSale, dashboardData, fetchSales } from "../controller/saleController";

const saleRouter = Router();

saleRouter.route("/").post(createSale).get(fetchSales);
saleRouter.route("/").post(createSale).get(fetchSales);
saleRouter.route("/dashboard").get(dashboardData);

export default saleRouter;
