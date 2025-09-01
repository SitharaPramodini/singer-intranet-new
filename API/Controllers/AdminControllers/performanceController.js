// controllers/performanceController.js
const db = require("../../DBconnection");

// ✅ Create Performance
exports.createPerformance = async (req, res) => {
    try {
        const { emp_ID, branch_ID, dep_ID, performance_title, description, startDate, endDate } = req.body;

        const missingFields = [];

if (!emp_ID) missingFields.push("Employee");
if (!branch_ID) missingFields.push("Branch");
if (!dep_ID) missingFields.push("Department");
if (!performance_title) missingFields.push("Performance Title");
if (!startDate) missingFields.push("Start Date");
if (!endDate) missingFields.push("End Date");

if (missingFields.length > 0) {
    return res.status(400).json({ 
        success: false, 
        message: `Required field(s) missing: ${missingFields.join(", ")}` 
    });
}


        const query = `
            INSERT INTO performance (emp_ID, branch_ID, dep_ID, performance_title, description, startDate, endDate, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
        `;
        await db.query(query, [emp_ID, branch_ID, dep_ID, performance_title, description, startDate, endDate]);

        res.status(201).json({ success: true, message: "Performance record created successfully" });
    } catch (error) {
        console.error("Error creating performance:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Get All Performance Records
exports.getPerformances = async (req, res) => {
    try {
        const query = `
            SELECT 
                p.performance_ID,
                p.emp_ID,
                e.first_name,
                e.last_name,
                e.emp_image,
                d.dep_name,
                b.branch_name,
                p.performance_title,
                p.description,
                p.startDate,
                p.endDate,
                p.status
            FROM performance p
            JOIN employee e ON p.emp_ID = e.emp_ID
            JOIN department d ON p.dep_ID = d.dep_ID
            JOIN branch b ON p.branch_ID = b.branch_ID
            ORDER BY p.startDate DESC
        `;
        const [results] = await db.query(query);

        res.status(200).json({ success: true, performances: results });
    } catch (error) {
        console.error("Error fetching performances:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Get Performance by ID
exports.getPerformanceById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = "SELECT * FROM performance WHERE performance_ID = ?";
        const [result] = await db.query(query, [id]);

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "Performance not found" });
        }

        res.status(200).json({ success: true, performance: result[0] });
    } catch (error) {
        console.error("Error fetching performance:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Update Performance
exports.updatePerformance = async (req, res) => {
    try {
        const { id } = req.params;
        const { performance_title, description } = req.body;

        const query = `
            UPDATE performance 
            SET performance_title = ?, description = ? 
            WHERE performance_ID = ?
        `;
        const [result] = await db.query(query, [performance_title, description, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Performance not found" });
        }

        res.status(200).json({ success: true, message: "Performance updated successfully" });
    } catch (error) {
        console.error("Error updating performance:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Delete Performance
exports.deletePerformance = async (req, res) => {
    try {
        const { id } = req.params;
        const query = "DELETE FROM performance WHERE performance_ID = ?";
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Performance not found" });
        }

        res.status(200).json({ success: true, message: "Performance deleted successfully" });
    } catch (error) {
        console.error("Error deleting performance:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// Deactivate Performance
exports.deactivatePerformance = async (req, res) => {
    try {
        const { id } = req.params;

        // Update performance status to 'deactivate'
        const query = `
            UPDATE performance
            SET status = 'deactivated'
            WHERE performance_ID = ?
        `;
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Performance not found' });
        }

        res.status(200).json({ success: true, message: 'Performance deactivated successfully' });
    } catch (error) {
        console.error('Error deactivating performance:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
