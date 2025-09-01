// Routes/AdminRoutes/announcementRoutes.js
const express = require("express");
const router = express.Router();
const eventLogController = require("../../Controllers/AdminControllers/eventLogController");
const { isAuthenticated, isAdmin } = require("../../Middleware/auth");

router.get("/", eventLogController.getAllEventLogs);

// Static named routes first
router.get("/today",  eventLogController.getTodayEventLogs);
router.get("/user/:emp_ID",  eventLogController.getEventLogsByUser);
router.get("/dep/:dep_ID",  eventLogController.getEventLogsByDepartment);

// Dynamic route after
router.get("/branch/:branch_ID",  eventLogController.getEventLogsByBranch);

router.put("/:id",  eventLogController.getEventLogsByDay);
router.delete("/:id",  eventLogController.filterEventLogs);


module.exports = router;
