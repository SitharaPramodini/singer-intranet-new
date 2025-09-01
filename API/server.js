// server.js
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();

const employeeRoutes = require('./Routes/employeeRoutes');
const performanceRoutes = require('./Routes/AdminRoutes/performanceRoutes');
const internationalDaysRoutes = require('./Routes/AdminRoutes/internationalDaysRoutes');
const festivalRoutes = require('./Routes/AdminRoutes/festivalRoutes');
const loginRoutes = require('./Routes/loginRoutes');
const announcementRoute = require('./Routes/AdminRoutes/announcementRoute');
const serviceRoute = require('./Routes/AdminRoutes/serviceRoute');
const directoryRoute = require('./Routes/directoryRoutes');

// Allow CORS for your frontend
app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true               // allow cookies/session
}));

app.use(express.json()); // to parse JSON bodies

// Configure session
app.use(session({
  secret: 'AbC@0987#XzY',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 300 * 600 * 1000          // 30 minutes
  }
}));

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/admin/performance', performanceRoutes);
app.use('/api/admin/internationalDays', internationalDaysRoutes);
app.use('/api/admin/festivals', festivalRoutes);
app.use('/api/admin/announcements', announcementRoute);
app.use('/api/admin/services', serviceRoute);
app.use('/api/employees/directory', directoryRoute);

// Default route
app.get('/', (req, res) => {
  res.send('Employee API is running');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
