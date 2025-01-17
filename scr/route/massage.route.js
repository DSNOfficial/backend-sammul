const massage_controller = require("../controller/massage.controller");
const { CheckToken } = require("../controller/user.controller");
const massage = (app) =>{
      
    app.post("/api/massage/create",massage_controller.create);
    app.get("/api/massage/getList",CheckToken(),massage_controller.getList);
    app.put("/api/massage/update",CheckToken(),massage_controller.update);
    app.delete("/api/massage/delete",CheckToken(),massage_controller.remove); 
     
}
module.exports = massage;


