const post_comment_controller = require("../controller/postComment.controller")
const postComment = (app) =>{
    app.get("/api/postComment/getList",post_comment_controller.getList);
    app.post("/api/postComment/create",post_comment_controller.create);
    app.put("/api/postComment/update",post_comment_controller.update);
    app.delete("/api/postComment/delete",post_comment_controller.remove); 
}
module.exports = postComment;
