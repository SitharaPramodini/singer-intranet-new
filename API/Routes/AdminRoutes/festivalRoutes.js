const express = require("express");
const router = express.Router();
const festivalController = require("../../Controllers/AdminControllers/festivalController");
const { isAuthenticated, isAdmin } = require("../../Middleware/auth");

// Admin-only CRUD routes
router.post("/", isAuthenticated, isAdmin, festivalController.addFestivalGreeting);           // Create
router.get("/", isAuthenticated, isAdmin, festivalController.getAllFestivalGreetings);         // Get all
router.get("/:id", isAuthenticated, isAdmin, festivalController.getFestivalGreetingById);      // Get by ID
router.put("/:id", isAuthenticated, isAdmin, festivalController.updateFestivalGreeting);        // Update
router.delete("/:id", isAuthenticated, isAdmin, festivalController.deleteFestivalGreeting);     // Delete

module.exports = router;