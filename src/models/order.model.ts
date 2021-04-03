import { Model, AllowNull, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, NotEmpty, PrimaryKey, Table, BelongsToMany } from "sequelize-typescript";
import Sequelize from 'sequelize';
import Template from "./template.model";
import User from "./user.model";
export interface OrderInterface {
    id?: number | null,
    date: Date,
    state: string,
    UserId: number,
    templates: Template[],
    addTemplates: Sequelize.BelongsToManyAddAssociationsMixin<Template, 'order_templates'>;
}

@Table({
    tableName: "orders",
    timestamps: true
})
export default class Order extends Model implements OrderInterface {

    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    id?: number;

    @AllowNull(false)
    @NotEmpty
    @Column(DataType.DATE)
    date!: Date;

    @AllowNull(false)
    @NotEmpty
    @Column(DataType.STRING)
    state!: string;

    @ForeignKey(() => User)
    UserId!: number

    @BelongsToMany(() => Template, {
        through: "order_templates", foreignKey: "OrderId",
        otherKey: "TemplateId",
    })
    templates!: Template[];

    addTemplates!:Sequelize.BelongsToManyAddAssociationsMixin<Template, 'order_templates'>;

}