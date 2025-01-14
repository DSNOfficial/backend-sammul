
const user_controller = require("../controller/user.controller");
const { CheckToken } = require("../controller/user.controller");

const user = (app) => {
    // Public routes
    
   
    app.post("/api/user/login", user_controller.login);
    app.post("/api/refresh_token",CheckToken(), user_controller.refresh_token);


    app.get("/api/user/getList",CheckToken(), user_controller.getList);
    app.post("/api/user/create",CheckToken(), user_controller.create);
    app.put("/api/user/update", CheckToken(),user_controller.update);
    app.post("/api/user/setPassword", CheckToken(),user_controller.setPassword);
    app.delete("/api/user/delete",CheckToken(), user_controller.remove);
  
};

module.exports = user;





