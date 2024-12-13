import { Request, Response } from "express";
import SaleModel from "../models/Sale";
import Items from "../models/Items";
import Customers from "../models/Customers";
import mongoose, { Mongoose, ObjectId } from "mongoose";

export const createSale = async (req: Request, res: Response) => {
  console.log("--createSale---body----", req.body);

  const generateReceiptNumber = async (): Promise<string> => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };
  const { date, customerId, totalAmount, items } = req.body;

  try {
    const userId = req.userId;
    if (!userId) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }
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
      userId,
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
    const userId = req.userId;
    if (!userId) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }
    const allSales = await SaleModel.find({ userId })
      .populate("customerId")
      .sort({ date: -1 });
    if (!allSales) res.status(400).json({ message: "get sales failed" });
    res.status(200).json(allSales);
  } catch (error) {
    console.error("Error in get sales:", error);
    res.status(500).json({ message: "Error finding sales" });
  }
};

export const dashboardData = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    console.log("userId------", userId);

    if (!userId) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const [totalCustomers, totalItems] = await Promise.all([
      Customers.countDocuments({ userId }),
      Items.countDocuments({ userId }),
    ]);

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Total Sales and Daily Earnings
    const salesData = await SaleModel.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: { $toDate: "$date" },
            },
          },
          totalSales: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // console.log("Sales Data:", salesData);

    const totalSales = salesData.reduce(
      (sum, record) => sum + record.totalSales,
      0
    );

    const lastFiveCustomers = await Customers.find({ userId })
      .sort({ createdAt: -1 }) // Assuming timestamps
      .limit(5);

    const itemNames = await Items.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Respond with aggregated data
    res.status(200).json({
      totalCustomers,
      totalItems,
      totalSales,
      dailyEarnings: salesData,
      lastFiveCustomers,
      itemNames,
    });
  } catch (error) {
    console.error("Error in fetching dashboard data:", error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
};
