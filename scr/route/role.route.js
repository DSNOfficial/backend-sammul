
const role_controller = require("../controller/role.controller");
const { CheckToken } = require("../controller/user.controller");
const role = (app) =>{   

   // Protected routes 
    app.get("/api/role/getList",CheckToken(),role_controller.getList);
    app.post("/api/role/create",CheckToken(),role_controller.create);
    app.put("/api/role/update",CheckToken(),role_controller.update);
    app.delete("/api/role/delete",CheckToken(),role_controller.remove); 

}
module.exports = role;
