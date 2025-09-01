const db = require("../../DBconnection");

// ✅ Get all festival greetings
exports.getAllFestivalGreetings = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Festival_greetings");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get festival greeting by ID
exports.getFestivalGreetingById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      "SELECT * FROM Festival_greetings WHERE festival_ID = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Festival greeting not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Add a new festival greeting
exports.addFestivalGreeting = async (req, res) => {
  try {
    const {
      festival_title,
      greeting,
      added_by,
      dep_ID,
      company_ID,
      branch_ID,
      festival_image,
      emp_ID,
      start_date,
      end_date
    } = req.body;

    // Validate required fields
    if (!festival_title || !greeting || !added_by || !start_date || !end_date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [result] = await db.query(
      `INSERT INTO Festival_greetings 
        (festival_title, greeting, added_by, added_datetime, dep_ID, company_ID, branch_ID, festival_image, emp_ID, start_date, end_date) 
       VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?)`,
      [
        festival_title,
        greeting,
        added_by,
        dep_ID,
        company_ID,
        branch_ID,
        festival_image,
        emp_ID,
        start_date,
        end_date
      ]
    );

    res.json({
      message: "Festival greeting added successfully",
      festival_ID: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update festival greeting
exports.updateFestivalGreeting = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      festival_title,
      greeting,
      dep_ID,
      company_ID,
      branch_ID,
      festival_image,
      emp_ID,
      start_date,
      end_date
    } = req.body;

    const [result] = await db.query(
      `UPDATE Festival_greetings 
       SET festival_title = ?, greeting = ?, dep_ID = ?, company_ID = ?, branch_ID = ?, 
           festival_image = ?, emp_ID = ?, start_date = ?, end_date = ?
       WHERE festival_ID = ?`,
      [
        festival_title,
        greeting,
        dep_ID,
        company_ID,
        branch_ID,
        festival_image,
        emp_ID,
        start_date,
        end_date,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Festival greeting not found" });
    }

    res.json({ message: "Festival greeting updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete festival greeting
exports.deleteFestivalGreeting = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(
      "DELETE FROM Festival_greetings WHERE festival_ID = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Festival greeting not found" });
    }

    res.json({ message: "Festival greeting deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
