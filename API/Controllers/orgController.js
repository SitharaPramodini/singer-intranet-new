const db = require('../DBconnection');

// Get top-level employees (no supervisor HRIS)
exports.getTopEmployees = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT emp_ID, first_name, last_name, emp_image, HRIS, supervisor_HRIS, position 
       FROM employee 
       WHERE supervisor_HRIS IS NULL OR supervisor_HRIS = ''`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching top-level employees" });
  }
};

// Get employees by supervisor HRIS (expand children)
exports.getEmployeesBySupervisor = async (req, res) => {
  try {
    const { supervisor_HRIS } = req.params;

    const [rows] = await db.query(
      `SELECT emp_ID, first_name, last_name, emp_image, HRIS, supervisor_HRIS, position
       FROM employee 
       WHERE supervisor_HRIS = ?`,
      [supervisor_HRIS]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching employees by supervisor" });
  }
};
