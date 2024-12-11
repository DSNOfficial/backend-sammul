
const socialmedia_controller = require("../controller/category.controller");
//const { CheckToken } = require("../controller/user.controller");
const socialmedia  = (app) =>{
    app.get("/api/socialmedia/getList",socialmedia_controller.getList);
   // app.use(CheckToken());
    app.post("/api/socialmedia/create",socialmedia_controller.create);
    app.put("/api/socialmedia/update",socialmedia_controller.update);
    app.delete("/api/socialmedia/delete",socialmedia_controller.remove); 
}
module.exports = socialmedia;
