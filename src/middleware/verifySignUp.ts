import { NextFunction, Request, Response } from "express";

import User from "../models/user.model";
const db = require('./../database')

const checkDuplicateEmail = (req: Request, res:Response, next: NextFunction) :Promise<void> | undefined  => {
  if (!req.body.email) {
    res.status(400).send({
      message: "Failed! Email is invalid!",
    });
    return;
  }
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "Failed! Email is already in use!",
      });
      return;
    }
    next();
  });
};

const verifySignUp = {
  checkDuplicateEmail: checkDuplicateEmail,
};

export default verifySignUp;
