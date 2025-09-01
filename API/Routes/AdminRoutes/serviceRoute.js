const express = require("express");
const router = express.Router();
const serviceController = require("../../Controllers/AdminControllers/servicesController");
const { isAuthenticated, isAdmin } = require("../../Middleware/auth");

// Admin-only routes
router.get("/", isAuthenticated, isAdmin, serviceController.getAllServices);

module.exports = router;