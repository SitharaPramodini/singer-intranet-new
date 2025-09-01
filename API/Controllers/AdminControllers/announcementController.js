const db = require("../../DBconnection");

// Add new announcement
exports.addAnnouncement = async (req, res) => {
  try {
    const {
      announcement_type,
      announcement_title,
      announcement_description,
      announcement_img,
      updated_by,
      start_datetime,
      end_datetime,
      service_ID,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO announcement 
      (announcement_type, announcement_title, announcement_description, announcement_img, updated_by, updated_datetime, start_datetime, end_datetime, service_ID) 
      VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?)`,
      [
        announcement_type,
        announcement_title,
        announcement_description,
        announcement_img,
        updated_by,
        start_datetime,
        end_datetime,
        service_ID,
      ]
    );

    res.status(201).json({ message: "Announcement added successfully", announcement_ID: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all announcements
exports.getAllAnnouncements = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, 
             e.first_name, 
             e.last_name 
      FROM announcement a
      LEFT JOIN employee e ON a.updated_by = e.emp_ID
      ORDER BY a.start_datetime DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get active announcements
exports.getActiveAnnouncements = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, 
             e.first_name, 
             e.last_name 
      FROM announcement a
      LEFT JOIN employee e ON a.updated_by = e.emp_ID
      WHERE a.start_datetime <= NOW() 
        AND a.end_datetime >= NOW()
      ORDER BY a.start_datetime ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get old announcements
exports.getOldAnnouncements = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, 
             e.first_name, 
             e.last_name 
      FROM announcement a
      LEFT JOIN employee e ON a.updated_by = e.emp_ID
      WHERE a.end_datetime < NOW()
      ORDER BY a.end_datetime DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get upcoming announcements
exports.getUpcomingAnnouncements = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, 
             e.first_name, 
             e.last_name 
      FROM announcement a
      LEFT JOIN employee e ON a.updated_by = e.emp_ID
      WHERE a.start_datetime > NOW()
      ORDER BY a.start_datetime ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get announcement by ID
exports.getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT a.*, 
             e.first_name, 
             e.last_name 
      FROM announcement a
      LEFT JOIN employee e ON a.updated_by = e.emp_ID
      WHERE a.announcement_ID = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update announcement
exports.updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      announcement_title,
      announcement_description,
      announcement_img,
      updated_by,
      start_datetime,
      end_datetime,
    } = req.body;

    const [result] = await db.query(
      `UPDATE announcement 
       SET announcement_title=?, announcement_description=?, announcement_img=?, updated_by=?, updated_datetime=NOW(), start_datetime=?, end_datetime=?
       WHERE announcement_ID=?`,
      [
        announcement_title,
        announcement_description,
        announcement_img,
        updated_by,
        start_datetime,
        end_datetime,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.json({ message: "Announcement updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM announcement WHERE announcement_ID = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.json({ message: "Announcement deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
