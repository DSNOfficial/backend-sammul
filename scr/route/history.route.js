
const history_controller = require("../controller/history.controller");
const {upload} = require("../config/helper");
const history = (app) =>{

    app.get("/api/history/getList",history_controller.getList);
    app.get("/api/history/getone/:id",history_controller.getOne);
    app.post("/api/history/create",upload.single("image"),history_controller.create);
    app.put("/api/history/update",upload.single("image"),history_controller.update);
    app.delete("/api/history/delete",history_controller.remove);    
}
module.exports = history;


