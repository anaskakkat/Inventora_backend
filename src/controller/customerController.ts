import { Request, Response } from "express";
import Customers from "../models/Customers";

export const createCustomer = async (req: Request, res: Response) => {
  const { name, address, mobile } = req.body;

  try {
    const existingCustomer = await Customers.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingCustomer) {
      res
        .status(400)
        .json({ message: "Customer with the same name already exists." });
      return;
    }

    const newCustomer = new Customers({ name, address, mobile });
    await newCustomer.save();

    res.status(201).json({ message: "Customer created successfully" });
  } catch (error) {
    console.error("Error in createCustomer:", error);
    res.status(500).json({ message: "Error creating customer" });
  }
};

export const fetchCustomerData = async (req: Request, res: Response) => {
  try {
    const customerData = await Customers.find();
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
