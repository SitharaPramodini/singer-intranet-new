const db = require("../../DBconnection");

// Get all announcements
exports.getAllServices = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM service`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
