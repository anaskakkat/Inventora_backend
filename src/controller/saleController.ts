import { Request, Response } from "express";
import SaleModel from "../models/Sale";

export const createSale = async (req: Request, res: Response) => {
  console.log("--createSale---body----", req.body);
  const generateReceiptNumber = async (): Promise<string> => {
    let number: string;
    const existingSale = await SaleModel.findOne({}, { receiptNumber: 1 });
    // do {
    number = Math.floor(10000 + Math.random() * 90000).toString(); // Generates a random 5-digit number
    // } while (existingSale && existingSale.receiptNumber === number);
    return number;
  };
  try {
    const { date, customerId, total, items } = req.body;

    const receiptNumber = await generateReceiptNumber();

    const newSale = new SaleModel({
      date,
      customerId,
      items,
      totalAmount: total,
      receiptNumber,
    });

    await newSale.save();

    res.status(201).json({ message: "Sale created successfully" });
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ message: "Error creating sale", error });
  }
};

export const fetchSales = async (req: Request, res: Response) => {
  try {
    const allSales = await SaleModel.find().populate("customerId").sort({date:-1})
    if (!allSales) res.status(400).json({ message: "get sales failed" });
    res.status(200).json(allSales);
  } catch (error) {
    console.error("Error in get sales:", error);
    res.status(500).json({ message: "Error finding sales" });
  }
};

// export const deleteItem = async (req: Request, res: Response) => {
//   console.log("--signout---body----", req.params.itemId);
//   const { itemId } = req.params;
//   try {
//     const deletedItem = await Items.findByIdAndDelete(itemId);
//     if (!deletedItem) {
//       res.status(404).json({ message: "Item not found" });
//       return;
//     }
//     res.status(200).json({ message: "Item deleted successfully" });
//   } catch (error) {
//     console.error("Error in delete Item:", error);
//     res.status(500).json({ message: "Error deleting item" });
//   }
// };

// export const editItems = async (req: Request, res: Response) => {
//   // console.log(
//   //   "--signout---body----",
//   //   req.params.itemId,
//   //   "------body------",
//   //   req.body
//   // );
//   const { itemId } = req.params;

//   try {
//     const existingItem = await Items.findOne({
//       name: { $regex: new RegExp(`^${req.body.name}$`, "i") },
//       _id: { $ne: itemId },
//     });
//     if (existingItem) {
//       res
//         .status(400)
//         .json({ message: "Item with the same name already exists." });
//       return;
//     }
//     const updatedItem = await Items.findByIdAndUpdate(itemId, req.body, {
//       new: true,
//     });

//     if (!updatedItem) {
//       res.status(404).json({ message: "Item not found" });
//     }

//     res.status(200).json({
//       message: "Item updated successfully",
//     });
//   } catch (error) {
//     console.error("Error in edit item:", error);
//     res.status(500).json({ message: "Error updating item" });
//   }
// };
