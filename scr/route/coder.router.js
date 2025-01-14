const coder_controller = require("../controller/coder.controller");
const { CheckToken } = require("../controller/user.controller");

const coder = (app) => {   
    app.get("/api/coder/getList", coder_controller.getList);
    app.post("/api/coder/create",CheckToken(), coder_controller.create);  
}

module.exports = coder;
