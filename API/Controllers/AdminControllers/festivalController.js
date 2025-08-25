const db = require("../../DBconnection");
// Get all festival greetings
exports.getAllFestivalGreetings = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM festival_greetings");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by ID
exports.getFestivalGreetingById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM festival_greetings WHERE festival_ID = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Festival greeting not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add new
exports.addFestivalGreeting = async (req, res) => {
  try {
    const { festival_title, greeting, added_by, added_datetime, dep_ID, company_ID, branch_ID, festival_image, emp_ID } = req.body;

    const [result] = await db.query(
      "INSERT INTO festival_greetings (festival_title, greeting, added_by, added_datetime, dep_ID, company_ID, branch_ID, festival_image, emp_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [festival_title, greeting, added_by, added_datetime, dep_ID, company_ID, branch_ID, festival_image, emp_ID]
    );

    res.json({ message: "Festival greeting added", festival_ID: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.updateFestivalGreeting = async (req, res) => {
  try {
    const { id } = req.params;
    const { festival_title, greeting, dep_ID, company_ID, branch_ID, festival_image, emp_ID } = req.body;

    const [result] = await db.query(
      "UPDATE festival_greetings SET festival_title = ?, greeting = ?, dep_ID = ?, company_ID = ?, branch_ID = ?, festival_image = ?, emp_ID = ? WHERE festival_ID = ?",
      [festival_title, greeting, dep_ID, company_ID, branch_ID, festival_image, emp_ID, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Festival greeting not found" });
    }

    res.json({ message: "Festival greeting updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
exports.deleteFestivalGreeting = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM festival_greetings WHERE festival_ID = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Festival greeting not found" });
    }

    res.json({ message: "Festival greeting deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
