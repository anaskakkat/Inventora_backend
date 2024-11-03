import { Router } from "express";
import {
  createCustomer,
  deleteCustomer,
  fetchCustomerData,
  getSalesDatabyCustomerId,
  updateCustomer,
} from "../controller/customerController";

const customerRouter = Router();

customerRouter.route("/").post(createCustomer).get(fetchCustomerData);
customerRouter
  .route("/:customerId")
  .delete(deleteCustomer)
  .patch(updateCustomer);
customerRouter.route("/:customerId/sales").get(getSalesDatabyCustomerId);

export default customerRouter;
