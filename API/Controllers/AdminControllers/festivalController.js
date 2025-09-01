const db = require("../../DBconnection");
// Get all festival greetings
exports.getAllFestivalGreetings = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Festival_greetings");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by ID
exports.getFestivalGreetingById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM Festival_greetings WHERE festival_ID = ?", [id]);
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
    const { festival_title, greeting, added_by, added_datetime, festival_image } = req.body;

    const [result] = await db.query(
      "INSERT INTO Festival_greetings (festival_title, greeting, added_by, added_datetime, festival_image) VALUES (?, ?, ?, ?, ?)",
      [festival_title, greeting, added_by, added_datetime, festival_image]
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
    const { festival_title, greeting, added_datetime, festival_image } = req.body;

    const [result] = await db.query(
      "UPDATE Festival_greetings SET festival_title = ?, greeting = ?, added_datetime = ?, festival_image = ? WHERE festival_ID = ?",
      [festival_title, greeting, added_datetime, festival_image, id]
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
    const [result] = await db.query("DELETE FROM Festival_greetings WHERE festival_ID = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Festival greeting not found" });
    }

    res.json({ message: "Festival greeting deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};