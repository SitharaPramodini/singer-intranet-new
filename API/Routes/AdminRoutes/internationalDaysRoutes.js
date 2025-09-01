// routes/AdminRoutes/internationalDaysRoutes.js
const express = require("express");
const router = express.Router();
const internationalDaysController = require("../../Controllers/AdminControllers/internationalDaysController");
const { isAuthenticated, isAdmin } = require("../../Middleware/auth");

// Admin-only CRUD routes
router.post("/", isAuthenticated, isAdmin, internationalDaysController.createDay);           // Create
router.get("/", isAuthenticated, isAdmin, internationalDaysController.getAllDays);         // Get all
router.get("/:id", isAuthenticated, isAdmin, internationalDaysController.getDayById);      // Get by ID
router.put("/:id", isAuthenticated, isAdmin, internationalDaysController.updateDay);        // Update
router.delete("/:id", isAuthenticated, isAdmin, internationalDaysController.deleteDay);     // Delete

// Public endpoint: get today’s international day(s) (month & day only)
router.get("/today", internationalDaysController.getTodayDays);

module.exports = router;
