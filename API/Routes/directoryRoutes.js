// Routes/AdminRoutes/directoryRoutes.js
const express = require("express");
const router = express.Router();
const directoryController = require("../Controllers/directoryController");

// Get all employees
router.get("/", directoryController.getAllEmployees);
router.get("/:branch_ID/:dep_ID", directoryController.getEmployeesByBranchAndDepartment);

module.exports = router;
