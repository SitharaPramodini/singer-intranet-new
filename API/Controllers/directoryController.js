const db = require('../DBconnection');

exports.getAllEmployees = async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT e.emp_ID, e.first_name, e.last_name, e.emp_email, e.emp_image, 
           e.dep_ID, e.company_ID, e.branch_ID, e.position, e.extention, b.branch_name, d.dep_name
            FROM employee e, branch b, department d
            WHERE e.branch_ID = b.branch_ID AND e.dep_ID = d.dep_ID`);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
};

// ✅ Get all employees for a given branch_ID
exports.getEmployeesByBranchAndDepartment = async (req, res) => {
  try {
    const { branch_ID, dep_ID } = req.params;

    if (!branch_ID || !dep_ID) {
      return res.status(400).json({ error: "branch_ID and dep_ID are required" });
    }

    const [rows] = await db.query(
      `SELECT 
        e.emp_ID,
        e.first_name,
        e.last_name,
        e.emp_email,
        e.emp_image,
        e.dep_ID,
        e.company_ID,
        e.branch_ID,
        e.position,
        e.extention,
        b.branch_name,
        d.dep_name
      FROM employee e
      JOIN branch b ON e.branch_ID = b.branch_ID
      JOIN department d ON e.dep_ID = d.dep_ID
      WHERE e.branch_ID = ? AND e.dep_ID = ?`,
      [branch_ID, dep_ID]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching employees by branch and department" });
  }
};
