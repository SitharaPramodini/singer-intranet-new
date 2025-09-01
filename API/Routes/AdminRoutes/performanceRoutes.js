const express = require("express");
const router = express.Router();
const performanceController = require("../../Controllers/AdminControllers/performanceController");
const { isAuthenticated, isAdmin } = require("../../Middleware/auth");

// Admin-only routes
router.post("/", isAuthenticated, isAdmin, performanceController.createPerformance);
router.get("/", isAuthenticated, isAdmin, performanceController.getPerformances);
router.get("/:id", isAuthenticated, isAdmin, performanceController.getPerformanceById);
router.put("/:id", isAuthenticated, isAdmin, performanceController.updatePerformance);
router.delete("/:id", isAuthenticated, isAdmin, performanceController.deletePerformance);
router.put("/deactivate/:id", isAuthenticated, isAdmin, performanceController.deactivatePerformance);

module.exports = router;