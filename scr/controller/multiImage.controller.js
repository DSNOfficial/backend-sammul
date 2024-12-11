const db = require("../config/db")
const { logError,isEmptyOrNull ,removeFile} = require("../config/helper")



const getlist = async (req, res) => {
    try {
        const [list] = await db.query("SELECT * FROM multi_images")
        res.json({
            message: 'This is listing route.',
            list
        })
    } catch (err) {
        logError("multi_images.getlist", err, res)
    }
}


const create = async (req, res) => {
    try {
        const { postId, status ,title} = req.body;
        const images = req.files; // Multer stores the array of files in req.files
        let message = {}; // Empty object to hold error messages

        // Validate inputs
        if (isEmptyOrNull(postId)) {
            message.postId = "postId required!";
        }
        if (!images || images.length === 0) {
            message.Image = "At least one image is required!";
        }
        if (isEmptyOrNull(status)) {
            message.status = "Status required!";
        }
        if (Object.keys(message).length > 0) {
            res.json({
                error: true,
                message: message
            });
            return false;
        }

        // Prepare SQL statements and parameters
        let sql = "INSERT INTO multi_images (postId,Image,title, status) VALUES ";
        let params = [];
        let placeholders = images.map(() => "(?, ?, ?, ?)").join(", ");

        // Append each image's details to the params array
        images.forEach(image => {
            params.push(postId,image.filename,title, status);
        });

        // Complete the SQL statement
        sql += placeholders;

        // Execute the SQL query
        const [data] = await db.query(sql, params);

        res.json({
            data: data
        });
    } catch (err) {
        logError("multi_images.create", err, res);
    }
};


const remove = async (req,res)=>{
    try{
            var param = {
                postId : req.body.postId
            }
            const [dataInfo] = await db.query("SELECT * FROM multi_images WHERE postId=:postId",param);
            if(dataInfo.length > 0){
                var sql = "DELETE FROM multi_images WHERE postId = :postId"
                const [data] = await db.query(sql,param);
                if(data.affectedRows){
                    
                    // if delete success then unlink|remove file
                    // filename?

                    const removeFilePromises = dataInfo.map(image => removeFile(image.Image));
                    await Promise.all(removeFilePromises); // Ensure all file deletions are completed

                    //remove one image 
                    // await removeFile( dataInfo[0].Image) // Get image from 
                
                }
                res.json({
                    message: data.affectedRows != 0 ? "Remove success" : "Not found",
                    data:data
                })
            }else{
                res.json({
                    message:  "Not found",
                    error:true
                }) 
            }
            
    }catch(err){
        logError("multi_images.remove",err,res)
    }
}



const update = async (req, res) => {
    try {
        var sql =`UPDATE multi_images SET
        postId = :postId, status = :status,title =:title WHERE id = :id`;
        var param = {
            id: req.body.id,
            postId: req.body.postId,        
            status: req.body.status,
            title: req.body.title,
   
            
        }
        const [data] = await db.query(sql, param);
        res.json({
            message: (data.affectedRows != 0 ? "Update successfully" : "Not found"),
            data
        })
    } catch (err) {
        logError("multi_images.update", err, res)
    }
}



module.exports = {
    getlist,
    create,
    update,
    remove,

}