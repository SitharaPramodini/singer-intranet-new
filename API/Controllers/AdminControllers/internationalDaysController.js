// controllers/internationalDaysController.js
const db = require("../../DBconnection");

// ✅ Create International Day
exports.createDay = async (req, res) => {
    try {
        const { day_title, day_description, date, added_by, day_image } = req.body;

        if (!day_title || !date || !added_by) {
            return res.status(400).json({ success: false, message: "Required fields missing" });
        }

        const query = `
            INSERT INTO internationalDays (day_title, day_description, date, added_by, day_image)
            VALUES (?, ?, ?, ?, ?)
        `;
        await db.query(query, [day_title, day_description, date, added_by, day_image]);

        res.status(201).json({ success: true, message: "International day created successfully" });
    } catch (error) {
        console.error("Error creating day:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Get All International Days
exports.getAllDays = async (req, res) => {
    try {
        const query = `
            SELECT 
                i.day_ID, 
                i.day_title, 
                i.day_description, 
                DATE_FORMAT(i.date, '%m-%d') AS day_month, 
                CONCAT(e.first_name, ' ', e.last_name) AS added_by, 
                i.day_image
            FROM internationalDays i
            JOIN employee e ON i.added_by = e.emp_ID
            ORDER BY i.date;
        `;
        const [results] = await db.query(query);
        res.status(200).json({ success: true, days: results });
    } catch (error) {
        console.error("Error fetching days:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Get International Day by ID
exports.getDayById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = "SELECT * FROM internationalDays WHERE day_ID = ?";
        const [result] = await db.query(query, [id]);

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "Day not found" });
        }

        res.status(200).json({ success: true, day: result[0] });
    } catch (error) {
        console.error("Error fetching day:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Update International Day
exports.updateDay = async (req, res) => {
    try {
        const { id } = req.params;
        const { day_title, day_description, date, day_image } = req.body;

        const query = `
            UPDATE internationalDays
            SET day_title = ?, day_description = ?, date = ?, day_image = ?
            WHERE day_ID = ?
        `;
        const [result] = await db.query(query, [day_title, day_description, date, day_image, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Day not found" });
        }

        res.status(200).json({ success: true, message: "Day updated successfully" });
    } catch (error) {
        console.error("Error updating day:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Delete International Day
exports.deleteDay = async (req, res) => {
    try {
        const { id } = req.params;
        const query = "DELETE FROM internationalDays WHERE day_ID = ?";
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Day not found" });
        }

        res.status(200).json({ success: true, message: "Day deleted successfully" });
    } catch (error) {
        console.error("Error deleting day:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Get International Days for Today (month & day only)
exports.getTodayDays = async (req, res) => {
    try {
        const query = `
            SELECT day_ID, day_title, day_description, added_by, day_image
            FROM internationalDays
            WHERE DATE_FORMAT(date, '%m-%d') = DATE_FORMAT(CURDATE(), '%m-%d')
        `;
        const [results] = await db.query(query);

        if (results.length === 0) {
            return res.status(200).json({ success: true, message: "No international day today", days: [] });
        }

        res.status(200).json({ success: true, days: results });
    } catch (error) {
        console.error("Error fetching today's international day:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
