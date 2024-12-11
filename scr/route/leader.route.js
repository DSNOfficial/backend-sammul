
const leader_controller = require("../controller/leader.controller");
const {upload} = require("../config/helper");
const leader = (app) =>{

    app.get("/api/leader/getList",leader_controller.getList);
    app.get("/api/leader/getone/:id",leader_controller.getOne);
    app.post("/api/leader/create",upload.single("image"),leader_controller.create);
    app.put("/api/leader/update",upload.single("image"),leader_controller.update);
    app.delete("/api/leader/delete",leader_controller.remove);    
}
module.exports = leader;


