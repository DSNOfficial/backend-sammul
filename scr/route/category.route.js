
const category_controller = require("../controller/category.controller");
const { CheckToken } = require("../controller/user.controller");
const category = (app) =>{
    app.get("/api/category/getList",category_controller.getList);
    
    app.post("/api/category/create",CheckToken(),category_controller.create);
    app.put("/api/category/update",CheckToken(),category_controller.update);
    app.delete("/api/category/delete",CheckToken(),category_controller.remove); 
}
module.exports = category;
