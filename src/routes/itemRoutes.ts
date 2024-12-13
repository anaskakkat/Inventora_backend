import { Router } from "express";
import {
  createItem,
  deleteItem,
  editItems,
  getAllItems,
} from "../controller/itemController";
import { authenticateUser } from "../middleware/authenticateUser ";

const itemRouter = Router();

itemRouter
  .route("/")
  .post(authenticateUser, createItem)
  .get(authenticateUser, getAllItems);
itemRouter.route("/:itemId").delete(deleteItem).patch(authenticateUser,editItems);

export default itemRouter;
