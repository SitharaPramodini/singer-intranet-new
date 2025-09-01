// Routes/AdminRoutes/announcementRoutes.js
const express = require("express");
const router = express.Router();
const announcementController = require("../../Controllers/AdminControllers/AnnouncementController");
const { isAuthenticated, isAdmin } = require("../../Middleware/auth");

router.post("/", isAuthenticated, isAdmin, announcementController.addAnnouncement);
router.get("/", isAuthenticated, isAdmin, announcementController.getAllAnnouncements);

// Static named routes first
router.get("/active", isAuthenticated, isAdmin,  announcementController.getActiveAnnouncements);
router.get("/old", isAuthenticated, isAdmin,  announcementController.getOldAnnouncements);
router.get("/upcoming", isAuthenticated, isAdmin,  announcementController.getUpcomingAnnouncements);

// Dynamic route after
router.get("/:id", isAuthenticated, isAdmin,  announcementController.getAnnouncementById);

router.put("/:id", isAuthenticated, isAdmin,  announcementController.updateAnnouncement);
router.delete("/:id",  isAuthenticated, isAdmin, announcementController.deleteAnnouncement);


module.exports = router;
