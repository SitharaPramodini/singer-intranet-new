// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../Controllers/employeeController');
const eventLogController = require('../Controllers/AdminControllers/eventLogController');
const announcementController = require('../Controllers/AdminControllers/AnnouncementController');
const { isAuthenticated } = require('../Middleware/auth'); 

const orgchartController = require("../Controllers/orgController")

// Routes
router.get('/all-employees', employeeController.getAllEmployees);
router.get('/all-branches', employeeController.getAllBranches);
router.get('/all-departments', employeeController.getAllDepartments);
router.get('/today-Bdays', employeeController.getTodaysBirthdays);
router.get('/today-anniversary', employeeController.getTodayAnniversaries);
router.get('/new-joinees', employeeController.getNewJoinees);
router.get('/new-performance', employeeController.getPerformance);
router.get('/userDetails/:emp_ID', employeeController.getEmployeeDetails);
router.get('/international-days', employeeController.getInternationalDays);
router.get('/festivals', employeeController.getFestivals);
router.get('/banner', employeeController.getBanners);
router.post('/create-eventLog', eventLogController.addEventLog);

// Get active announcements (current date is between start_date and end_date)
router.get("/announcements/active", announcementController.getActiveAnnouncements);

router.get("/orgchart/top", orgchartController.getTopEmployees);
router.get("/orgchart/:supervisor_HRIS", orgchartController.getEmployeesBySupervisor);

module.exports = router;
