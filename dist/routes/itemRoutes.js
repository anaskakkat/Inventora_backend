"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const itemController_1 = require("../controller/itemController");
const authenticateUser_1 = require("../middleware/authenticateUser ");
const itemRouter = (0, express_1.Router)();
itemRouter
    .route("/")
    .post(authenticateUser_1.authenticateUser, itemController_1.createItem)
    .get(authenticateUser_1.authenticateUser, itemController_1.getAllItems);
itemRouter.route("/:itemId").delete(itemController_1.deleteItem).patch(authenticateUser_1.authenticateUser, itemController_1.editItems);
exports.default = itemRouter;
