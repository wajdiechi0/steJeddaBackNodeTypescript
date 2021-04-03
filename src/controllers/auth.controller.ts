import User from '../models/user.model';
import { Request, Response } from "express";
import { UserInterface } from "../models/user.model";
var bcrypt = require("bcryptjs");

exports.signup = async (req: Request, res: Response): Promise<void> => {
    const userInfo: UserInterface = req.body;
    if (userInfo.password) {
        userInfo.password = bcrypt.hashSync(req.body.password, 8);
    }

    var validator = require("email-validator");
    !validator.validate(req.body.email) ? res.status(200).send({ code: 500, message: "wrong email format" }) :

        await User.create(userInfo).then(() => {
            res.status(200).send({ code: 200, message: userInfo })
        }).catch((err: Error) => {
            res.status(200).send({ code: 500, message: err.message })
        })
}

exports.signin = async (req: Request, res: Response): Promise<void> => {
    const userInfo: UserInterface = req.body;
    await User.findOne({
        where: {
            email: userInfo.email,
        },
    })
        .then((user: User | null) => {
            if (!user) {
                return res.status(200).send({ code: 404, message: "User not found" });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(200).send({
                    code: 401,
                    accessToken: null,
                    message: "Invalid Password!",
                });
            }
            res.status(200).send({
                code: 200,
                data: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    name: user.name,
                },
            });
        })
        .catch((err: Error) => {
            res.status(500).send({ message: err.message });
        });
};
