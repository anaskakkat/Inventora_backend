import { Router } from "express";
import { createSale, fetchSales } from "../controller/saleController";


const saleRouter = Router();

saleRouter.route("/").post(createSale).get(fetchSales)

// saleRouter.route("/:itemId").delete(deleteItem).patch(editItems)

export default saleRouter;
