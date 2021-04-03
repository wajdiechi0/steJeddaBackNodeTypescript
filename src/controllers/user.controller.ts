const db = require("../database");
import User from '../models/user.model';
import { Request, Response } from "express";

exports.getUserEmail = async (req: Request, res: Response) : Promise<void> => {
    if (req.query.id) {
      User.findOne({
        where: {
          id: req.query.id,
        },
      }).then((user: User | null) => {
        if (user) {
  
          res.status(200).send({
            code: 200,
            data: user.email,
            message: "success",
          });
          return;
        } else {
          res.status(200).send({
            code: 404,
            data: {},
            message: "User not found",
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
  
  exports.getUserList = async (req: Request, res: Response) : Promise<void> => {
    User.findAll({
      where:{
        role:"user"
      }
    }).then((users: User[])=>{
  
      res.status(200).send({
        code: 200,
        data: users,
        message: "success",
      });
    })
    return;
  };
  
  