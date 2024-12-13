import { Request, Response } from "express";
import Customers from "../models/Customers";
import SaleModel from "../models/Sale";

export const createCustomer = async (req: Request, res: Response) => {
  const { name, address, mobile } = req.body;

  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized: User ID not found" });
      return;
    }

    const existingCustomer = await Customers.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      userId,
    });

    if (existingCustomer) {
      res.status(400).json({
        message: "Customer with the same name already exists for this user.",
      });
      return;
    }

    const newCustomer = new Customers({ name, address, mobile, userId });
    await newCustomer.save();

    res.status(201).json({
      message: "Customer created successfully",
      customer: newCustomer,
    });
  } catch (error) {
    console.error("Error in createCustomer:", error);
    res.status(500).json({ message: "Error creating customer" });
  }
};

export const fetchCustomerData = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized: User ID not found" });
      return;
    }
    const customerData = await Customers.find({ userId });
    if (!customerData)
      res.status(400).json({ message: "get Customers failed" });
    res.status(200).json(customerData);
  } catch (error) {
    console.error("Error in get Customers:", error);
    res.status(500).json({ message: "Error finding Customers" });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  console.log("--signout---body----", req.params.customerId);
  const { customerId } = req.params;
  try {
    const deletedCustomer = await Customers.findByIdAndDelete(customerId);
    if (!deletedCustomer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error in delete Customer:", error);
    res.status(500).json({ message: "Error deleting Customer" });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  const { customerId } = req.params; // Ensure you're correctly extracting itemId from req.params
  console.log(
    "--updateCustomer---itemId----",
    customerId,
    "------body------",
    req.body
  );

  try {
    const existingItem = await Customers.findOne({
      name: { $regex: new RegExp(`^${req.body.name}$`, "i") },
      _id: { $ne: customerId },
    });

    if (existingItem) {
      res
        .status(400)
        .json({ message: "Customer with the same name already exists." });
      return;
    }

    const updatedItem = await Customers.findByIdAndUpdate(
      customerId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedItem) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }

    res.status(200).json({
      message: "Customer updated successfully",
    });
  } catch (error) {
    console.error("Error in updating customer:", error);
    res.status(500).json({ message: "Error updating customer" });
  }
};

export const getSalesDatabyCustomerId = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;

    // Convert customerId to ObjectId
    // const customerObjectId = new mongoose.Types.ObjectId(customerId);

    // Find sales for the given customerId
    const sales = await SaleModel.find({ customerId });

    if (sales.length === 0) {
      res.status(404).json({ message: "No sales found for this customer." });
      return;
    }

    // Return found sales
    res.status(200).json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
