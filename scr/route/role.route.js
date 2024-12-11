
const role_controller = require("../controller/role.controller");
//const { CheckToken } = require("../controller/user.controller");
const role = (app) =>{   

   // Protected routes
    //  app.use(CheckToken()); // Apply middleware to all routes defined after this line
    app.get("/api/role/getList",role_controller.getList);
    //app.use(CheckToken()); 
    app.post("/api/role/create",role_controller.create);
    app.put("/api/role/update",role_controller.update);
    app.delete("/api/role/delete",role_controller.remove); 

     // app.use(CheckToken()); 
}
module.exports = role;
