const db = require("../config/db");
const { logError, removeFile } = require("../config/helper");

// Get all news posts
const getList = async (req, res) => {
    try {
        let sql = "SELECT pn.id, pn.title, pn.description, i.image_path " +
                  "FROM post_news pn " +
                  "JOIN post_images i ON pn.id = i.news_id";

        const [list] = await db.query(sql);
        res.json({
            message: 'List of news posts',
            list
        });
        
    } catch (err) {
        logError("post_news.getList", err, res);
    }
};

// Create a new news post with image upload
const create = async (req, res) => {
    try {
        const { title, description } = req.body;
        const images = req.files; // Multer stores the array of files in req.files

        // Validate inputs
        if (!title || !description || !images || images.length === 0) {
            return res.status(400).json({ error: true, message: 'Title, description, and at least one image are required' });
        }

        // Start a transaction for atomicity
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Insert news post
            const newsQuery = 'INSERT INTO post_news (title, description) VALUES (?, ?)';
            const [postResult] = await connection.execute(newsQuery, [title, description]);
            const newsId = postResult.insertId;

            // Insert images if any
            const imageQuery = 'INSERT INTO post_images (news_id, image_path) VALUES (?, ?)';
            const imageValues = images.map(image => [newsId, image.filename]);
            await Promise.all(imageValues.map(value => connection.execute(imageQuery, value)));

            // Commit the transaction
            await connection.commit();

            res.json({
                message: 'News post added successfully',
                data: { id: newsId, title, description }
            });
        } catch (err) {
            await connection.rollback();
            throw err; // Re-throw the error to be caught by the outer catch block
        } finally {
            connection.release(); // Release the connection back to the pool
        }
    } catch (err) {
        logError("post_news.create", err, res);
    }
};


// Update a news post by ID
const update = async (req, res) => {
    try {
        const { id, title, description } = req.body;

        // Validate inputs
        if (!id || !title || !description) {
            return res.status(400).json({ error: true, message: 'ID, title, and description are required' });
        }

        // Update news post
        const sql = 'UPDATE post_news SET title = ?, description = ? WHERE id = ?';
        const [data] = await db.query(sql, [title, description, id]);

        res.json({
            message: (data.affectedRows !== 0 ? "News post updated successfully" : "Not found"),
            data
        });
    } catch (err) {
        logError("post_news.update", err, res);
    }
};

// Remove a news post by ID
const remove = async (req, res) => {
    try {
        const { id } = req.body;

        // Fetch news post details for file removal
        const [postInfo] = await db.query("SELECT * FROM post_news WHERE id = ?", [id]);
        if (postInfo.length === 0) {
            return res.status(404).json({ error: true, message: 'News post not found' });
        }

        // Start a transaction for atomicity
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Delete images associated with the news post
            const deleteImagesQuery = 'DELETE FROM post_images WHERE news_id = ?';
            await connection.execute(deleteImagesQuery, [id]);

            // Delete the news post itself
            const deletePostQuery = 'DELETE FROM post_news WHERE id = ?';
            const [deleteResult] = await connection.execute(deletePostQuery, [id]);

            // Commit the transaction
            await connection.commit();

            res.json({
                message: (deleteResult.affectedRows !== 0 ? "News post deleted successfully" : "Not found"),
                data: deleteResult
            });
        } catch (err) {
            await connection.rollback();
            throw err; // Re-throw the error to be caught by the outer catch block
        } finally {
            connection.release(); // Release the connection back to the pool
        }
    } catch (err) {
        logError("post_news.remove", err, res);
    }
};
const updateImages = async (req, res) => {
    try {
        const { id } = req.body;
        const images = req.files; // Assuming images are uploaded via multipart/form-data

        // Validate inputs
        if (!id || !images || images.length === 0) {
            return res.status(400).json({ error: true, message: 'ID and at least one image are required' });
        }

        // Start a transaction for atomicity
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Delete existing images for the news post
            const deleteImagesQuery = 'DELETE FROM post_images WHERE news_id = ?';
            await connection.execute(deleteImagesQuery, [id]);

            // Insert updated images
            const imageValues = images.map(image => [id, image.filename]);
            const imageQuery = 'INSERT INTO post_images (news_id, image_path) VALUES ?';
            await connection.execute(imageQuery, [imageValues]);

            // Commit the transaction
            await connection.commit();

            res.json({
                message: 'Images updated successfully',
                data: { id, images: imageValues.map(value => ({ news_id: id, image_path: value[1] })) }
            });
        } catch (err) {
            await connection.rollback();
            throw err; // Re-throw the error to be caught by the outer catch block
        } finally {
            connection.release(); // Release the connection back to the pool
        }
    } catch (err) {
        logError("post_news.updateImages", err, res);
    }
};


module.exports = {
    getList,
    create,
    update,
    remove,
    updateImages
};
