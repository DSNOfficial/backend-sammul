const db = require("../config/db");
const { logError} = require("../config/helper");

const getList = async (req, res) => {
    try {
        const [list] = await db.query("SELECT * FROM tbcodes ORDER BY created_at DESC");
        res.json({
            message: 'This is the listing route.',
            list,
            userThatRequested: req.user
        });
    } catch (err) {
        logError("tbcodes.getList", err, res);
    }
};


const create = async (req, res) => {
    try {
        const code = generateCode();
        const query = 'INSERT INTO tbcodes (code) VALUES (?)';
        const [result] = await db.query(query, [code]);

        res.json({ id: result.insertId, code });
    } catch (err) {
        logError("tbcodes.create", err, res);
    }
};

// Assuming generateCode is defined somewhere in your codebase:
const generateCode = () => {
    // This is just a simple example. Adjust as needed.
    const year = new Date().getFullYear().toString().slice(-2); // Get last 2 digits of the year
    const uniqueId = String(Date.now()).slice(-3); // Get last 3 digits of current timestamp
    return `CODE-${uniqueId}-${year}`;
};




module.exports = {
    getList,
    create,
}