const db = require("../../DBconnection");

// Get all event logs
exports.getAllEventLogs = async (req, res) => {
    try {
        const query = `SELECT * FROM event_log ORDER BY event_datetime DESC`;
        const [rows] = await db.query(query);
        res.status(200).json({ message: 'All event logs retrieved', data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve event logs' });
    }
};

// Get today's event logs
exports.getTodayEventLogs = async (req, res) => {
    try {
        const query = `
            SELECT * FROM event_log
            WHERE DATE(event_datetime) = CURDATE()
            ORDER BY event_datetime DESC
        `;
        const [rows] = await db.query(query);
        res.status(200).json({ message: 'Today\'s event logs retrieved', data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve today\'s event logs' });
    }
};

// Get event logs by user ID
exports.getEventLogsByUser = async (req, res) => {
    try {
        const { emp_ID } = req.params;
        const query = `SELECT * FROM event_log WHERE emp_ID = ? ORDER BY event_datetime DESC`;
        const [rows] = await db.query(query, [emp_ID]);
        res.status(200).json({ message: 'Event logs for user retrieved', data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve user event logs' });
    }
};

// Get event logs by department ID
exports.getEventLogsByDepartment = async (req, res) => {
    try {
        const { dep_ID } = req.params;
        const query = `
            SELECT el.* FROM event_log el
            JOIN employee e ON el.emp_ID = e.emp_ID
            WHERE e.dep_ID = ?
            ORDER BY el.event_datetime DESC
        `;
        const [rows] = await db.query(query, [dep_ID]);
        res.status(200).json({ message: 'Event logs for department retrieved', data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve department event logs' });
    }
};

// Get event logs by branch ID
exports.getEventLogsByBranch = async (req, res) => {
    try {
        const { branch_ID } = req.params;
        const query = `
            SELECT el.* FROM event_log el
            JOIN employee e ON el.emp_ID = e.emp_ID
            WHERE e.branch_ID = ?
            ORDER BY el.event_datetime DESC
        `;
        const [rows] = await db.query(query, [branch_ID]);
        res.status(200).json({ message: 'Event logs for branch retrieved', data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve branch event logs' });
    }
};

// Filter event logs by specific day (YYYY-MM-DD)
exports.getEventLogsByDay = async (req, res) => {
    try {
        const { date } = req.params; // e.g., 2025-09-01
        const query = `SELECT * FROM event_log WHERE DATE(event_datetime) = ? ORDER BY event_datetime DESC`;
        const [rows] = await db.query(query, [date]);
        res.status(200).json({ message: 'Event logs for the day retrieved', data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve event logs for the day' });
    }
};

// Filter event logs by category, sub_category, or service_ID
exports.filterEventLogs = async (req, res) => {
    try {
        const { category, sub_category, service_ID } = req.query;
        const conditions = [];
        const values = [];

        if (category) {
            conditions.push('category = ?');
            values.push(category);
        }
        if (sub_category) {
            conditions.push('sub_category = ?');
            values.push(sub_category);
        }
        if (service_ID) {
            conditions.push('service_ID = ?');
            values.push(service_ID);
        }

        let query = 'SELECT * FROM event_log';
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        query += ' ORDER BY event_datetime DESC';

        const [rows] = await db.query(query, values);
        res.status(200).json({ message: 'Filtered event logs retrieved', data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to filter event logs' });
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