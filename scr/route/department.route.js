
const department_controller = require("../controller/department.controller");
const {upload} = require("../config/helper");
//const { CheckToken } = require("../controller/user.controller");
const department = (app) =>{
    // app.use(CheckToken());
    app.get("/api/department/getlist",department_controller.getList);
    app.post("/api/department/getone",department_controller.getOne);
    //app.use(CheckToken());
    app.post("/api/department/create",upload.single("image"),department_controller.create);
    app.put("/api/department/update",upload.single("image"), department_controller.update);
    app.delete("/api/department/delete",department_controller.remove); 
}
module.exports = department;
