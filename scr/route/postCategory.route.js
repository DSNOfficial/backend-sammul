
const postCategory_controller = require("../controller/postCategory.controller")
const { CheckToken } = require("../controller/user.controller");
const postCategory = (app) =>{
    app.get("/api/postCategory/getList",postCategory_controller.getList);
    
    app.post("/api/postCategory/create",CheckToken(),postCategory_controller.create);
    app.put("/api/postCategory/update",CheckToken(),postCategory_controller.update);
    app.delete("/api/postCategory/delete",CheckToken(),postCategory_controller.remove); 
}
module.exports = postCategory;
