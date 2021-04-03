import { Application } from "express";

const controller = require("../controllers/user.controller");
module.exports = (app: Application) => {
  app.get("/api/getuseremail", controller.getUserEmail);
  app.get("/api/getuserlist", controller.getUserList);

}
