// controllers/employeeController.js
const db = require('../DBconnection');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  try {
    const [users] = await db.query('SELECT * FROM user_login WHERE username = ? AND password = ?', [username, password]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Store user ID in session
    req.session.userId = users[0].user_ID;
    req.session.username = users[0].username;
    req.session.role = users[0].role;

    res.status(200).json({
      message: "Login successful",
      sessionID: req.sessionID,
      expiresIn: req.session.cookie.maxAge, // in milliseconds
      user: { user_ID: users[0].user_ID, username: users[0].username, role: users[0].role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to login" });
  }
};
