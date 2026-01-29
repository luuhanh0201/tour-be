import { Router } from "express";
import {
  findAllCustomerController,
  findCustomerByIdController,
  createCustomerController,
  updateCustomerController,
  deleteCustomerController,
} from "./customer.controller.js";

const customerRoute = Router();

customerRoute.get("/", findAllCustomerController);
customerRoute.get("/:id", findCustomerByIdController);
customerRoute.post("/create", createCustomerController);
customerRoute.put("/update/:id", updateCustomerController);
customerRoute.delete("/delete/:id", deleteCustomerController);

export default customerRoute;
