import { Router } from "express";
import { createCustomer, deleteCustomer, fetchCustomerData, updateCustomer } from "../controller/customerController";

const customerRouter = Router();

customerRouter.route("/").post(createCustomer).get(fetchCustomerData)
customerRouter.route("/:customerId").delete(deleteCustomer).patch(updateCustomer)

export default customerRouter;
