import { Router } from "express";
import {
  createItem,
  deleteItem,
  editItems,
  getAllItems,
} from "../controller/itemController";

const itemRouter = Router();

itemRouter.route("/").post(createItem).get(getAllItems);
itemRouter.route("/:itemId").delete(deleteItem).patch(editItems)

export default itemRouter;
