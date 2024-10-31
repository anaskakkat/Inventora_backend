import { Request, Response } from "express";
import Items from "../models/Items";

export const createItem = async (req: Request, res: Response) => {
  // console.log("--signout---body----", req.body);
  const { name, description, quantity, unit, price } = req.body;
  try {
    const existingItem = await Items.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existingItem) {
      res
        .status(400)
        .json({ message: "Item with the same name already exists." });
      return;
    }
    const newItem = new Items({
      name,
      description,
      quantity,
      unit,
      price,
    });
    await newItem.save();
    res.status(201).json({ message: "Item created successfully" });
  } catch (error) {
    console.error("Error in createItem:", error);
    res.status(500).json({ message: "Error creating item" });
  }
};

export const getAllItems = async (req: Request, res: Response) => {
  try {
    const allItems = await Items.find();
    if (!allItems) res.status(400).json({ message: "get item failed" });
    res.status(200).json(allItems);
  } catch (error) {
    console.error("Error in get Item:", error);
    res.status(500).json({ message: "Error finding item" });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  console.log("--signout---body----", req.params.itemId);
  const { itemId } = req.params;
  try {
    const deletedItem = await Items.findByIdAndDelete(itemId);
    if (!deletedItem) {
      res.status(404).json({ message: "Item not found" });
      return;
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error in delete Item:", error);
    res.status(500).json({ message: "Error deleting item" });
  }
};

export const editItems = async (req: Request, res: Response) => {
  // console.log(
  //   "--signout---body----",
  //   req.params.itemId,
  //   "------body------",
  //   req.body
  // );
  const { itemId } = req.params;

  try {
    const existingItem = await Items.findOne({
      name: { $regex: new RegExp(`^${req.body.name}$`, "i") },
      _id: { $ne: itemId },
    });
    if (existingItem) {
      res
        .status(400)
        .json({ message: "Item with the same name already exists." });
      return;
    }
    const updatedItem = await Items.findByIdAndUpdate(itemId, req.body, {
      new: true,
    });

    if (!updatedItem) {
      res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      message: "Item updated successfully",
    });
  } catch (error) {
    console.error("Error in edit item:", error);
    res.status(500).json({ message: "Error updating item" });
  }
};
