const post_comment_controller = require("../controller/postComment.controller")
const { CheckToken } = require("../controller/user.controller");
const postComment = (app) =>{
    app.get("/api/postComment/getList",post_comment_controller.getList);
    
    app.post("/api/postComment/create",CheckToken(),post_comment_controller.create);
    app.put("/api/postComment/update",CheckToken(),post_comment_controller.update);
    app.delete("/api/postComment/delete",CheckToken(),post_comment_controller.remove); 
}
module.exports = postComment;
