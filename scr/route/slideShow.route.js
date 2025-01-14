
const slideShow_controller = require("../controller/slideShow.controller");
const { CheckToken } = require("../controller/user.controller");
const {upload_multi} = require("../config/helper");

const slideShow = (app) =>{
    app.get("/api/slideShow/getList",slideShow_controller.getList);
   
    app.post("/api/slideShow/create",CheckToken(),upload_multi.array("images",10),slideShow_controller.create);
    app.put("/api/slideShow/update", CheckToken(),upload_multi.single("images",10), slideShow_controller.update);
    app.delete("/api/slideShow/delete",CheckToken(),slideShow_controller.remove); 
}
module.exports = slideShow;
