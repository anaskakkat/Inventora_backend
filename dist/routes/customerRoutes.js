"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerController_1 = require("../controller/customerController");
const authenticateUser_1 = require("../middleware/authenticateUser ");
const customerRouter = (0, express_1.Router)();
// Define routes
customerRouter.route("/")
    .post(authenticateUser_1.authenticateUser, customerController_1.createCustomer)
    .get(authenticateUser_1.authenticateUser, customerController_1.fetchCustomerData);
customerRouter.route("/:customerId")
    .delete(customerController_1.deleteCustomer)
    .patch(customerController_1.updateCustomer);
customerRouter.route("/:customerId/sales")
    .get(customerController_1.getSalesDatabyCustomerId);
exports.default = customerRouter;
