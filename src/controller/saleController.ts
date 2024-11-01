import { Request, Response } from "express";
import SaleModel from "../models/Sale";
import Items from "../models/Items";

export const createSale = async (req: Request, res: Response) => {
  console.log("--createSale---body----", req.body);

  const generateReceiptNumber = async (): Promise<string> => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  try {
    const { date, customerId, totalAmount, items } = req.body;

    // Check stock availability
    for (const item of items) {
      const itemInStock = await Items.findById(item._id);
      if (!itemInStock || itemInStock.quantity < item.quantity) {
        res.status(400).json({
          message: `Insufficient stock for item ${item.itemId}`,
        });
        return;
      }
    }

    const receiptNumber = await generateReceiptNumber();

    // Create a new sale
    const newSale = new SaleModel({
      date,
      customerId,
      items,
      totalAmount,
      receiptNumber,
    });

    await newSale.save();

    // Update stock levels
    for (const item of items) {
      await Items.findByIdAndUpdate(item._id, {
        $inc: { quantity: -item.quantity },
      });
    }

    res.status(201).json({ message: "Sale created successfully" });
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ message: "Error creating sale", error });
  }
};

export const fetchSales = async (req: Request, res: Response) => {
  try {
    const allSales = await SaleModel.find()
      .populate("customerId")
      .sort({ date: -1 });
    if (!allSales) res.status(400).json({ message: "get sales failed" });
    res.status(200).json(allSales);
  } catch (error) {
    console.error("Error in get sales:", error);
    res.status(500).json({ message: "Error finding sales" });
  }
};
