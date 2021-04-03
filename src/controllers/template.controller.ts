import { TemplateInterface } from "../models/template.model";
import { Request, Response } from "express";
import multer = require('multer');
const path = require("path");
import Template from '../models/template.model';
import Cart, { CartInterface } from '../models/cart.model';
import Order, { OrderInterface } from '../models/order.model';

exports.uploadTemplateDetails = async (req: Request, res: Response): Promise<void> => {
  const templateInfo: TemplateInterface = req.body;
  await Template.create(templateInfo).then((template: Template) => {
    res.status(200).send({
      code: 200,
      data: { idTemplate: template.id },
      message: "Operation Completed Successfully",
    });
  }).catch((err: Error) => {
    res.status(200).send({ code: 500, message: err.message });
  });
};


interface MulterRequest extends Request {
  fileValidationError: any;
}
exports.uploadTemplateImage = async (req: MulterRequest, res: Response): Promise<void> => {
  let idTemplate = req.query.id;
  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "templateImages");
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
    },
  });
  let upload = multer({ storage: multerStorage }).single("image");
  upload(req, res, function (err: any) {
    if (req.fileValidationError) {
      res.status(200).send({ code: 400, message: req.fileValidationError });
      return;
    } else if (err instanceof multer.MulterError) {
      res.status(200).send({ code: 400, message: err });
      return;
    } else if (err) {
      res.status(200).send({ code: 400, message: err.message });
      return;
    } else if (!req.file) {
      res
        .status(200)
        .send({ code: 404, message: "Please select an image to upload" });
      return;
    }
    Template.update(
      {
        img: req.file.filename,
      },
      {
        where: { id: idTemplate },
      }
    ).then(() => { });
    res.status(200).send({ code: 200, data: req.file.filename });
  });
};

exports.uploadTemplateFile = async (req: MulterRequest, res: Response): Promise<void> => {
  let idTemplate = req.query.id;
  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "templateFiles");
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, "File-" + Date.now() + path.extname(file.originalname));
    },
  });
  let upload = multer({ storage: multerStorage }).single("file");
  upload(req, res, function (err: any) {
    if (req.fileValidationError) {
      res.status(200).send({ code: 400, message: req.fileValidationError });
      return;
    } else if (err instanceof multer.MulterError) {
      res.status(200).send({ code: 400, message: err });
      return;
    } else if (err) {
      res.status(200).send({ code: 400, message: err.message });
      return;
    } else if (!req.file) {
      res
        .status(200)
        .send({ code: 404, message: "Please select a file to upload" });
      return;
    }
    Template.update(
      {
        file: req.file.filename,
      },
      {
        where: { id: idTemplate },
      }
    ).then(() => { });
    res.status(200).send({ code: 200, data: req.file.filename });
  });
};
exports.fetchTemplateList = async (req: Request, res: Response): Promise<void> => {
  await Template.findAll().catch((err: Error) => {
    res.status(200).send({ code: 500, message: "error" });
    return;
  }).then((templates: Template[] | void) => {

    res.status(200).send({
      code: 200,
      data: { templates },
    });
  });

  return;
};

exports.loadTemplateImage = async (req: Request, res: Response): Promise<void> => {
  let image = req.query.img;
  res.sendFile(path.resolve("templateImages/" + image));
  return;
};
exports.downloadTemplate = async (req: Request, res: Response): Promise<void> => {
  let file = req.query.file;
  res.sendFile(path.resolve("templateFiles/" + file));
  return;
};

exports.updateTemplate = async (req: Request, res: Response): Promise<void> => {
  const templateInfo: TemplateInterface = req.body;
  if (templateInfo.id) {
    Template.update(
      {
        name: templateInfo.name,
        description: templateInfo.description,
        price: templateInfo.price,
      },
      {
        where: { id: templateInfo.id },
      }
    ).then(() => { });
    res.status(200).send({
      code: 200,
      data: {},
      message: "success",
    });
  } else {
    res.status(200).send({
      code: 400,
      data: {},
      message: "id not provided",
    });
  }
  return;
};
exports.deleteTemplate = async (req: Request, res: Response): Promise<void> => {
  if (req.body.id) {
    Template.findOne({
      where: {
        id: req.body.id,
      },
    }).then((template: Template | null) => {
      if (template) {
        template.destroy();

        res.status(200).send({
          code: 200,
          data: template,
          message: "success",
        });
        return;
      } else {
        res.status(200).send({
          code: 404,
          data: {},
          message: "Template not found",
        });
        return;
      }
    });
  } else {
    res.status(200).send({
      code: 400,
      data: {},
      message: "id not provided",
    });
  }
  return;
};

exports.addToCart = async (req: Request, res: Response): Promise<void> => {
  const cartInfo: CartInterface = req.body;
  if (cartInfo.userId && cartInfo.templateId) {
    Cart.findOne({
      where: {
        userId: cartInfo.userId,
        templateId: cartInfo.templateId,
      },
    }).then((cart: Cart | null) => {
      if (cart) {
        res.status(200).send({
          code: 400,
          data: {},
          message: "template is already in user cart",
        });
      } else {
        Cart.create({
          userId: req.body.userId,
          templateId: req.body.templateId,
        }).then((cart: Cart) => {
          res.status(200).send({ code: 200, data: { cart }, message: "" });
          return;
        });
      }
    });
  } else {
    res.status(200).send({
      code: 400,
      data: {},
      message: "Incorrect arguemnts",
    });
  }
  return;
};
exports.deleteFromCart = async (req: Request, res: Response): Promise<void> => {
  const cartInfo: CartInterface = req.body;
  if (cartInfo.userId && cartInfo.templateId) {
    Cart.findOne({
      where: {
        userId: cartInfo.userId,
        templateId: cartInfo.templateId,
      },
    }).then((cart: Cart | null) => {
      if (cart) {
        cart.destroy();
        res.status(200).send({
          code: 200,
          data: cart,
          message: "",
        });
      } else {
        res.status(200).send({
          code: 200,
          data: {},
          message: "template not found in cart",
        });
      }
    });
  } else {
    res.status(200).send({
      code: 400,
      data: {},
      message: "Incorrect arguemnts",
    });
  }
  return;
};

exports.fetchCart = async (req: Request, res: Response): Promise<void> => {
  let userId = req.query.id;
  if (userId) {
    const cart = await Cart.findAll({
      where: {
        userId,
      },
    }).then((cart: Cart[]) => {
      let templates: Template[];
      const fetchTemplates = async (): Promise<void> => {
        for (let i = 0; i < cart.length; i++) {
          await Template.findOne({
            where: {
              id: cart[i].templateId,
            },
          }).then((template: Template | null) => {
            template && templates.push(template);
          });
        }

        res.status(200).send({ code: 200, data: templates, message: "" });
        return;
      };
      fetchTemplates();
    });
  } else {
    res.status(200).send({
      code: 400,
      data: {},
      message: "id not provided",
    });
  }
  return;
};

exports.clearCart = async (req: Request, res: Response): Promise<void> => {
  if (req.body.userId) {
    Cart.destroy({
      where: {
        userId: req.body.userId,
      },
    }).then((cart: number) => {
      if (cart) {
        res.status(200).send({
          code: 200,
          data: cart,
          message: "Cart cleared",
        });
      } else {
        res.status(200).send({
          code: 200,
          data: {},
          message: "template not found in cart",
        });
      }
    });
  } else {
    res.status(200).send({
      code: 400,
      data: {},
      message: "Incorrect arguemnts",
    });
  }
  return;
};

exports.createOrder = async (req: Request, res: Response): Promise<void> => {
  const OrderInfo: OrderInterface = req.body;
  if (OrderInfo.UserId && OrderInfo.templates) {
    const order: Order | void = await Order.create({
      date: new Date(),
      UserId: OrderInfo.UserId,
      state: "waiting",
    }).catch((err: Error) => {
      res
        .status(200)
        .send({ code: 500, data: {}, message: "Please check your entries" });
      return;
    });
    let templateList: Template[] = [];
    const fetchTemplates = async () => {
      for (let i = 0; i < OrderInfo.templates.length; i++) {
        await Template.findOne({
          where: {
            id: OrderInfo.templates[i].id
          },
        }).then((template: Template | null) => {
          template && templateList.push(template);
        })
      }
      order instanceof Order && order.addTemplates(templateList);
      res.status(200).send({ code: 200, data: order, message: templateList });
    }
    fetchTemplates();
  } else {
    res.status(200).send({
      code: 400,
      data: {},
      message: "Incorrect arguemnts",
    });
  }
  return;
};

exports.fetchOrders = async (req: Request, res: Response): Promise<void> => {
  if (req.body.userId) {
    Order.findAll({
      where: {
        userId: req.body.userId,
      },
      include: [
        {
          model: Template,
          as: "templates",
        },
      ],
    }).then(function (orders: Order[]) {
      res.status(200).send({ code: 200, data: orders, message: "success" });
      return;
    });
  } else {
    res.status(200).send({
      code: 400,
      data: {},
      message: "Incorrect arguemnts",
    });
  }
  return;
};

exports.fetchAllOrders = async (req: Request, res: Response): Promise<void> => {
  Order.findAll({
    include: [
      {
        model: Template,
        as: "templates",
      },
    ],
  }).then(function (orders: Order[]) {
    res.status(200).send({ code: 200, data: orders, message: "success" });
    return;
  });
  return;
};

exports.fetchOrderDetails = async (req: Request, res: Response): Promise<void> => {
  Order.findByPk(Number(req.body.orderId), {
    include: [
      {
        model: Template,
        as: "templates",
      },
    ],
  }).then(function (order: Order | null) {
    res.status(200).send({ code: 200, data: order, message: "success" });
    return;
  });
  return;
};

exports.markAsPaidOrder = async (req: Request, res: Response): Promise<void> => {
  if (req.body.orderId) {
    Order.update(
      {
        state: "paid",
      },
      {
        where: { id: req.body.orderId },
      }
    );
    res.status(200).send({ code: 200, data: {}, message: "success" });
  } else {
    res.status(200).send({
      code: 400,
      data: {},
      message: "Incorrect arguemnts",
    });
  }
  return;
};

exports.cancelOrder = async (req: Request, res: Response): Promise<void> => {
  if (req.body.orderId) {
    Order.update(
      {
        state: "canceled",
      },
      {
        where: { id: req.body.orderId },
      }
    );
    res.status(200).send({ code: 200, data: {}, message: "success" });
  } else {
    res.status(200).send({
      code: 400,
      data: {},
      message: "Incorrect arguemnts",
    });
  }
  return;
};

exports.fetchMyTemplates = async (req: Request, res: Response): Promise<void> => {
  Order.findAll(
    {
      where: {
        UserId: req.body.UserId,
        state: "paid"
      },
      include: [
        {
          model: Template,
          as: "templates",
        },
      ],
    }).then(function (orders: Order[]) {
      let myTemplates: Template[] = [];
      orders.map((order) => {
        for (let i = 0; i < order.templates.length; i++) {
          let existTest = false;
          for (let j = 0; j < myTemplates.length; j++)
            if (myTemplates[j].id === order.templates[i].id) {
              existTest = true;
            }
          if (!existTest) {
            myTemplates.push(order.templates[i]);
          }
        }
      });
      res.status(200).send({ code: 200, data: myTemplates, message: "success" });
      return;
    });
  return;
};

exports.ordersPerMonth = async (req: Request, res: Response): Promise<void> => {
  Order.findAll().then(function (orders: Order[]) {
    let ordersMonth = [];
    for (let i = 0; i < 12; i++) {
      ordersMonth[i] = 0;
    }
    for (let i = 0; i < orders.length; i++) {
      switch (String(orders[i].createdAt).split(' ')[1]) {
        case 'Jan': ordersMonth[0]++; break;
        case 'Feb': ordersMonth[1]++; break;
        case 'Mar': ordersMonth[2]++; break;
        case 'Apr': ordersMonth[3]++; break;
        case 'May': ordersMonth[4]++; break;
        case 'Jun': ordersMonth[5]++; break;
        case 'Jul': ordersMonth[6]++; break;
        case 'Aug': ordersMonth[7]++; break;
        case 'Sep': ordersMonth[8]++; break;
        case 'Oct': ordersMonth[9]++; break;
        case 'Nov': ordersMonth[10]++; break;
        case 'Dec': ordersMonth[11]++; break;
      }
    }
    res.status(200).send({ code: 200, data: ordersMonth, message: "success" });

  });
  return;
};

exports.ordersPerDay = async (req: Request, res: Response): Promise<void> => {
  Order.findAll().then(function (orders: Order[]) {
    let ordersDay = [];
    for (let i = 0; i < 31; i++) {
      ordersDay[i] = 0;
    }
    for (let i = 0; i < orders.length; i++) {
      if (Date().split(' ')[1] == String(orders[i].createdAt).split(' ')[1]) {
        ordersDay[Number(String(orders[i].createdAt).split(' ')[2]) - 1]++
      }
    }
    res.status(200).send({ code: 200, data: ordersDay, message: "success" });

  });
  return;
};

exports.totalOrdersN = async (req: Request, res: Response): Promise<void> => {
  Order.findAll().then(function (orders: Order[]) {
    res.status(200).send({ code: 200, data: orders.length, message: "success" });

  });
  return;
};
