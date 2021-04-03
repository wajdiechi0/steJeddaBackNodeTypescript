import { Application } from "express";
const controller = require("../controllers/auth.controller");
import verifySignUp from './../middleware/verifySignUp';
module.exports = (app: Application) => {
    app.post("/api/auth/signup",[verifySignUp.checkDuplicateEmail], controller.signup)
    app.post("/api/auth/signin", controller.signin);
}
