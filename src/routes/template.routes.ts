const controller = require("../controllers/template.controller");
import { Application } from "express";
const path = require("path");
module.exports = (app: Application) => {
  app.post("/api/template/uploadtemplate", controller.uploadTemplateDetails);
  app.post("/api/template/uploadtemplateimage", controller.uploadTemplateImage);
  app.post("/api/template/uploadtemplatefile", controller.uploadTemplateFile);
  app.get("/api/template/fetchtemplatelist", controller.fetchTemplateList);
  app.get("/api/template/loadtemplateimage", controller.loadTemplateImage);
  app.get("/api/template/downloadtemplate", controller.downloadTemplate);
  app.put("/api/template/updatetemplate", controller.updateTemplate);
  app.delete("/api/template/deletetemplate", controller.deleteTemplate);
  app.post("/api/template/addtocart", controller.addToCart);
  app.delete("/api/template/deletefromcart", controller.deleteFromCart);
  app.get("/api/template/fetchcart", controller.fetchCart);
  app.delete("/api/template/clearcart", controller.clearCart);
  app.post("/api/template/createorder", controller.createOrder);
  app.get("/api/template/fetchorders", controller.fetchOrders);
  app.get("/api/template/fetchallorders", controller.fetchAllOrders);
  app.put("/api/template/cancelorder", controller.cancelOrder);
  app.put("/api/template/markpaidorder", controller.markAsPaidOrder);
  app.get("/api/template/fetchmytemplates", controller.fetchMyTemplates);
  app.get("/api/template/fetchorderdetails", controller.fetchOrderDetails);
  app.get("/api/template/orderspermonth", controller.ordersPerMonth);
  app.get("/api/template/ordersperday", controller.ordersPerDay);
  app.get("/api/template/totalordersnumber", controller.totalOrdersN);
}

