const massage_controller = require("../controller/massage.controller");
const bodyParser = require('body-parser');
//const { CheckToken } = require("../controller/user.controller");
const massage = (app) =>{
    
    app.get("/api/massage/getList",massage_controller.getList);
    app.post("/api/massage/create",massage_controller.create);
    app.put("/api/massage/update",massage_controller.update);
    app.delete("/api/massage/delete",massage_controller.remove); 
       // app.use(CheckToken());
}
module.exports = massage;
