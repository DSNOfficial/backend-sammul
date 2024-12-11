
const postCategory_controller = require("../controller/postCategory.controller")
const postCategory = (app) =>{
    app.get("/api/postCategory/getList",postCategory_controller.getList);
    app.post("/api/postCategory/create",postCategory_controller.create);
    app.put("/api/postCategory/update",postCategory_controller.update);
    app.delete("/api/postCategory/delete",postCategory_controller.remove); 
}
module.exports = postCategory;
