
const history_controller = require("../controller/history.controller");
const {upload} = require("../config/helper");
const { CheckToken } = require("../controller/user.controller");
const history = (app) =>{

    app.get("/api/history/getList",history_controller.getList);
    app.get("/api/history/getone/:id",history_controller.getOne);

    app.post("/api/history/create",CheckToken(),upload.single("image"),history_controller.create);
    app.put("/api/history/update",CheckToken(),upload.single("image"),history_controller.update);
    app.delete("/api/history/delete",CheckToken(),history_controller.remove);    
}
module.exports = history;


