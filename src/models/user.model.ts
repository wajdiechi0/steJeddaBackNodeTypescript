import { Model, AllowNull, AutoIncrement, Column, DataType, HasMany, NotEmpty, PrimaryKey, Table, BelongsToMany } from "sequelize-typescript";
import Order from "./order.model";
import Template from "./template.model";

export interface UserInterface {
    id?: number | null,
    name: string,
    email: string,
    password: string,
    phone: string,
    birthdate: string,
    role: string,
    orders: Order[]
    templates: Template[];
}

@Table({
    tableName: "users",
    timestamps: true
})
export default class User extends Model implements UserInterface {

    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    id?: number;

    @AllowNull(false)
    @NotEmpty
    @Column(DataType.STRING)
    name!: string;

    @AllowNull(false)
    @NotEmpty
    @Column(DataType.STRING)
    email!: string;

    @AllowNull(false)
    @NotEmpty
    @Column(DataType.STRING)
    password!: string;

    @Column(DataType.STRING)
    phone!: string;

    @Column(DataType.STRING)
    birthdate!: string;

    @AllowNull(false)
    @NotEmpty
    @Column(DataType.STRING)
    role!: string;

    @HasMany(() => Order)
    orders!: Order[];

    @BelongsToMany(() => Template, {
        through: "user_templates",
        foreignKey: "UserId",
        otherKey: "TemplateId",
    })
    templates!: Template[];

}