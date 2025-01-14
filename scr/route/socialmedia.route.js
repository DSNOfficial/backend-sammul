
const socialmedia_controller = require("../controller/category.controller");
const { CheckToken } = require("../controller/user.controller");
const socialmedia  = (app) =>{
    app.get("/api/socialmedia/getList",socialmedia_controller.getList);
  
    app.post("/api/socialmedia/create",CheckToken(),socialmedia_controller.create);
    app.put("/api/socialmedia/update",CheckToken(),socialmedia_controller.update);
    app.delete("/api/socialmedia/delete",CheckToken(),socialmedia_controller.remove); 
}
module.exports = socialmedia;
