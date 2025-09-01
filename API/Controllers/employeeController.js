// controllers/employeeController.js
const db = require('../DBconnection');

// Get all employees
exports.getAllEmployees = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM employee');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
};
exports.getAllBranches = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM branch');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch branch' });
    }
};
exports.getAllDepartments = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM department');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch department' });
    }
};

// Get employees whose birthday is today
exports.getTodaysBirthdays = async (req, res) => {
    try {
        // MySQL query to match month and day only
        const query = `
      SELECT e.emp_ID, e.first_name, e.last_name, e.birthdate, d.dep_name, b.branch_name, e.emp_image
      FROM employee e, branch b, department d 
      WHERE MONTH(birthdate) = MONTH(CURDATE()) 
        AND DAY(birthdate) = DAY(CURDATE())
        AND e.dep_ID = d.dep_ID AND e.branch_ID = b.branch_ID
    `;

        const [rows] = await db.query(query);

        if (rows.length === 0) {
            return res.status(200).json({ message: 'No birthdays today', birthdays: [] });
        }

        res.status(200).json({ birthdays: rows });
    } catch (err) {
        console.error('Error fetching today\'s birthdays:', err);
        res.status(500).json({ error: 'Failed to fetch today\'s birthdays' });
    }
};

exports.getTodayAnniversaries = async (req, res) => {
    try {
        const query = `
            SELECT 
                e.emp_ID,
                e.emp_image,
                e.first_name,
                e.last_name,
                e.dep_ID,
                d.dep_name,
                e.branch_ID,
                b.branch_name,
                e.joined_datetime
            FROM employee e
            JOIN department d 
                ON e.dep_ID = d.dep_ID AND e.company_ID = d.company_ID AND e.branch_ID = d.branch_ID
            JOIN branch b 
                ON e.branch_ID = b.branch_ID AND e.company_ID = b.company_ID
            WHERE MONTH(e.joined_datetime) = MONTH(CURDATE())
              AND DAY(e.joined_datetime) = DAY(CURDATE())
              AND YEAR(e.joined_datetime) != YEAR(CURDATE())
        `;

        const [results] = await db.query(query);

        if (results.length === 0) {
            return res.status(200).json({ anniversaries: [] });
        }

        res.status(200).json({ anniversaries: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch today\'s work anniversaries' });
    }
};

// Get new joinees (today and yesterday)
exports.getNewJoinees = async (req, res) => {
    try {
        // MySQL query to get employees joined today or yesterday
        const query = `
            SELECT 
    e.emp_ID, 
    e.emp_image,
    e.first_name, 
    e.last_name, 
    d.dep_name, 
    b.branch_name, 
    e.joined_datetime
FROM employee e
JOIN department d ON e.dep_ID = d.dep_ID
JOIN branch b ON e.branch_ID = b.branch_ID
WHERE e.joined_datetime >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
ORDER BY e.joined_datetime DESC;
        `;

        const [results] = await db.query(query);

        res.status(200).json({
            success: true,
            newJoinees: results
        });
    } catch (error) {
        console.error('Error fetching new joinees:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch new joinees'
        });
    }
};

// Get star performance
exports.getPerformance = async (req, res) => {
    try {
        const { startDate, endDate } = req.query; // expected format: YYYY-MM-DD
        let query = `
            SELECT 
                p.emp_ID, 
                e.emp_image,
                e.first_name, 
                e.last_name, 
                d.dep_name, 
                b.branch_name, 
                p.startDate,
                p.endDate,
                p.performance_title,
                p.description
            FROM performance p
            INNER JOIN employee e ON p.emp_ID = e.emp_ID
            INNER JOIN branch b ON p.branch_ID = b.branch_ID
            INNER JOIN department d ON p.dep_ID = d.dep_ID
            WHERE 1=1
        `;
        
        let params = [];

        // Case 1: startDate + endDate from query
        if (startDate && endDate) {
            query += ` AND p.startDate >= ? AND p.endDate <= ?`;
            params.push(startDate, endDate);
        } 
        // Case 2: only startDate (default +7 days)
        else if (startDate && !endDate) {
            query += ` AND p.startDate >= ? AND p.startDate <= DATE_ADD(?, INTERVAL 7 DAY)`;
            params.push(startDate, startDate);
        } 
        // Case 3: no dates → default last 7 days (using startDate)
        else {
            query += ` AND p.startDate BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND CURDATE()`;
        }

        query += ` ORDER BY p.startDate DESC`;

        const [results] = await db.query(query, params);

        res.status(200).json({
            success: true,
            performances: results
        });
    } catch (error) {
        console.error('Error fetching performance:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch performance'
        });
    }
};


//get a employee by ID
exports.getEmployeeDetails = async (req, res) => {
    const emp_ID = req.params.emp_ID; // Get emp_ID from URL

    try {
        const query = 'SELECT * FROM employee WHERE emp_ID = ?';
        const [results] = await db.query(query, [emp_ID]); // Pass emp_ID here

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            success: true,
            employee: results[0]
        });
    } catch (error) {
        console.error('Error fetching employee details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch employee details'
        });
    }
};

// Get international days
exports.getInternationalDays = async (req, res) => {
    try {
        // MySQL query to match month and day only
        const query = `
            SELECT d.day_ID, d.day_title AS branch_name, d.day_description AS dep_name, d.date, d.added_by, d.day_image AS emp_image
            FROM internationalDays d
            WHERE MONTH(date) = MONTH(CURDATE()) 
                  AND DAY(date) = DAY(CURDATE())
        `;

        const [rows] = await db.query(query);

        if (rows.length === 0) {
            return res.status(200).json({ message: 'No international days', internationalDays: [] });
        }

        res.status(200).json({ internationalDays: rows });
    } catch (err) {
        console.error('Error fetching international days:', err);
        res.status(500).json({ error: 'Failed to fetch international days' });
    }
};

// Get festivals
exports.getFestivals = async (req, res) => {
    try {
        const query = `
            SELECT f.festival_ID, f.festival_title AS branch_name, f.greeting AS dep_name, f.added_datetime, f.added_by, f.festival_image AS emp_image, f.emp_ID
            FROM Festival_greetings f
            WHERE MONTH(added_datetime) = MONTH(CURDATE()) 
                  AND DAY(added_datetime) = DAY(CURDATE()) 
            `;

        const [rows] = await db.query(query);

        if (rows.length === 0) {
            return res.status(200).json({ message: 'No festival ', festivals: [] });
        }

        res.status(200).json({ festivals: rows });
    } catch (err) {
        console.error('Error fetching festivals', err);
        res.status(500).json({ error: 'Failed to fetch festivals' });
    }
};

// Get banners
exports.getBanners = async (req, res) => {
    try {
        const query = `
            SELECT *
            FROM banner b
            WHERE 
                STR_TO_DATE(DATE_FORMAT(CURDATE(), '2000-%m-%d'), '%Y-%m-%d')
                BETWEEN 
                STR_TO_DATE(DATE_FORMAT(start_at, '2000-%m-%d'), '%Y-%m-%d')
                AND 
                STR_TO_DATE(DATE_FORMAT(end_at, '2000-%m-%d'), '%Y-%m-%d')
        `;

        const [rows] = await db.query(query);

        if (rows.length === 0) {
            return res.status(200).json({ message: 'No banner', banners: [] });
        }

        res.status(200).json({ banners: rows });
    } catch (err) {
        console.error('Error fetching banners', err);
        res.status(500).json({ error: 'Failed to fetch banners' });
    }
};


// Create event
exports.addEventLog = async (req, res) => {
    try {
        const { category, sub_category, service_ID, emp_ID, event } = req.body;

        // Simple validation
        if (!category || !event) {
            return res.status(400).json({ error: 'Category and Event are required' });
        }

        const query = `
            INSERT INTO event_log (category, sub_category, service_ID, emp_ID, event_datetime, event)
            VALUES (?, ?, ?, ?, NOW(), ?)
        `;

        const values = [category, sub_category, service_ID, emp_ID, event];

        const [result] = await db.query(query, values);

        res.status(201).json({
            message: 'Event log created successfully',
            event_ID: result.insertId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create event log' });
    }
};
