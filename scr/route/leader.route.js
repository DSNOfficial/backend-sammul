
const leader_controller = require("../controller/leader.controller");
const {upload} = require("../config/helper");
const { CheckToken } = require("../controller/user.controller");
const leader = (app) =>{

    app.get("/api/leader/getList",leader_controller.getList);
    app.get("/api/leader/getone/:id",leader_controller.getOne);
    
    app.post("/api/leader/create",CheckToken(),upload.single("image"),leader_controller.create);
    app.put("/api/leader/update",CheckToken(),upload.single("image"),leader_controller.update);
    app.delete("/api/leader/delete",CheckToken(),leader_controller.remove);    
}
module.exports = leader;


