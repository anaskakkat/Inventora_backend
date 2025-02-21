"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const saleController_1 = require("../controller/saleController");
const authenticateUser_1 = require("../middleware/authenticateUser ");
const saleRouter = (0, express_1.Router)();
saleRouter
    .route("/")
    .post(authenticateUser_1.authenticateUser, saleController_1.createSale)
    .get(authenticateUser_1.authenticateUser, saleController_1.fetchSales);
saleRouter.route("/").post(saleController_1.createSale).get(saleController_1.fetchSales);
saleRouter.route("/dashboard").get(authenticateUser_1.authenticateUser, saleController_1.dashboardData);
exports.default = saleRouter;
