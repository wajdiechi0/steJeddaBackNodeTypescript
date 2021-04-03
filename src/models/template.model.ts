import { Model, AllowNull, AutoIncrement, Column, DataType, NotEmpty, PrimaryKey, Table, BelongsToMany } from "sequelize-typescript";
import Order from "./order.model";
import User from "./user.model";
export interface TemplateInterface {
    id?: number | null,
    name: string,
    description: string,
    img: string,
    price: number,
    file: string,
    users: User[]
    orders: Order[]
}

@Table({
    tableName: "templates",
    timestamps: true
})
export default class Template extends Model implements TemplateInterface {

    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    id?: number;

    @AllowNull(false)
    @NotEmpty
    @Column(DataType.STRING)
    name!: string;

    @Column(DataType.STRING(10000))
    description!: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    img!: string;

    @AllowNull(false)
    @NotEmpty
    @Column(DataType.FLOAT(6, 2))
    price!: number;

    @Column(DataType.STRING)
    file!: string;

    @BelongsToMany(() => User, {
        through: "user_templates",
        foreignKey: "TemplateId",
        otherKey: "UserId",
    })
    users!: User[];
    @BelongsToMany(() => Order, {
        through: "order_templates", foreignKey: "TemplateId",
        otherKey: "OrderId",
    })
    orders!: Order[];

}