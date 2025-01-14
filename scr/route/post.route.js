
const post_controller = require("../controller/post.controller");
const {upload} = require("../config/helper");
const { CheckToken } = require("../controller/user.controller");
const post = (app) =>{
    
    app.get("/api/post/getOne",post_controller.getOne);
    app.get("/api/post/getList",post_controller.getList);
    
    app.post("/api/post/create",CheckToken(),upload.single("image"),post_controller.create);
    app.put("/api/post/update",CheckToken(),upload.single("image"),post_controller.update);
    app.delete("/api/post/delete",CheckToken(),post_controller.remove);    
}
module.exports = post;


