
const post_controller = require("../controller/post.controller");
const {upload} = require("../config/helper");
//const { CheckToken } = require("../controller/user.controller");
const post = (app) =>{
    
    app.get("/api/post/getOne",post_controller.getOne);
    app.get("/api/post/getList",post_controller.getList);
    //app.use(CheckToken());
    app.post("/api/post/create",upload.single("image"),post_controller.create);
    app.put("/api/post/update",upload.single("image"),post_controller.update);
    app.delete("/api/post/delete",post_controller.remove);    
}
module.exports = post;


