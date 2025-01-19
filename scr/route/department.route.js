
const department_controller = require("../controller/department.controller");
const {upload} = require("../config/helper");
const { CheckToken } = require("../controller/user.controller");
const department = (app) =>{
   
    app.get("/api/department/getlist",department_controller.getList);
    app.post("/api/department/getone",department_controller.getOne);
    
    app.post("/api/department/create",CheckToken(),upload.single("image"),department_controller.create);
    app.put("/api/department/update",CheckToken(),upload.single("image"), department_controller.update);
    app.delete("/api/department/delete",CheckToken(),department_controller.remove); 
}
module.exports = department;
