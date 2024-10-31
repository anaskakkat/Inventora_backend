import { Router } from "express";
import {
  createItem,
  deleteItem,
  editItems,
  getAllItems,
} from "../controller/itemController";

const itemRouter = Router();

itemRouter.route("/items").post(createItem).get(getAllItems);
itemRouter.route("/items/:itemId").delete(deleteItem).patch(editItems)

export default itemRouter;
