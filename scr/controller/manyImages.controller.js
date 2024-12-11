const db = require("../config/db")
const { logError,isEmptyOrNull ,removeFile} = require("../config/helper")



const getlist = async (req, res) => {
    try {
        const [list] = await db.query('SELECT * FROM images');
        res.json({ list });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching images');
    }
};

// Get a single image by ID
const getone = async (req, res) => {
    const imageId = req.params.id;
  
    try {
      const [rows] = await db.query('SELECT * FROM images WHERE id = ?', [imageId]);
  
      if (rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.status(404).send('Image not found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching the image');
    }
  };
  

  const create = async (req, res) => {
    try {
        const files = req.files;
        const { title, description } = req.body;

        const imagePromises = files.map(file => {
            return db.query(
                'INSERT INTO images (filename, path, title, description) VALUES (?, ?, ?, ?)',
                [file.filename, file.path, title, description]
            );
        });

        await Promise.all(imagePromises);
        res.send('Images and text uploaded and saved to database successfully!');
    } catch (err) {
        console.error(err);
        res.status(400).send('Error uploading images and text');
    }
};




const remove =async (req, res) => {
    const imageId = req.params.id;
  
    try {
      const [rows] = await db.query('SELECT * FROM images WHERE id = ?', [imageId]);
  
      if (rows.length > 0) {
        const imagePath = rows[0].path;
  
        // Delete the image record from the database
        await db.query('DELETE FROM images WHERE id = ?', [imageId]);
  
        // Delete the image file from the local storage
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error deleting the image file');
            return;
          }
          res.send('Image deleted successfully!');
        });
      } else {
        res.status(404).send('Image not found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting the image');
    }
  };

const update = async (req, res) => {
    const imageId = req.params.id;
    const newFile = req.file;
  
    try {
      const [rows] = await db.query('SELECT * FROM images WHERE id = ?', [imageId]);
  
      if (rows.length > 0) {
        const oldImagePath = rows[0].path;
  
        await db.query(
          'UPDATE images SET filename = ?, path = ? WHERE id = ?',
          [newFile.filename, newFile.path, imageId]
        );
  
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error deleting the old image file');
            return;
          }
          res.send('Image updated successfully!');
        });
      } else {
        res.status(404).send('Image not found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating the image');
    }
  };


module.exports = {
    getlist,
    create,
    update,
    remove,
    getone,

}