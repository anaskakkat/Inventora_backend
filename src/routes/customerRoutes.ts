import { Router } from "express";
import {
  createCustomer,
  deleteCustomer,
  fetchCustomerData,
  getSalesDatabyCustomerId,
  updateCustomer,
} from "../controller/customerController";
import { authenticateUser } from "../middleware/authenticateUser ";

const customerRouter = Router();


// Define routes
customerRouter.route("/")
  .post(authenticateUser,createCustomer) 
  .get(authenticateUser,fetchCustomerData); 

customerRouter.route("/:customerId")
  .delete(deleteCustomer)
  .patch(updateCustomer);

customerRouter.route("/:customerId/sales")
  .get(getSalesDatabyCustomerId);

export default customerRouter;
