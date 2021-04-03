import { Model,AllowNull, AutoIncrement, Column, DataType, NotEmpty, PrimaryKey, Table, ForeignKey } from "sequelize-typescript";
import Template from "./template.model";
import User from "./user.model";

export interface CartInterface {
    id?: number | null,
    userId: string,
    templateId: string,
}

@Table({
    tableName: "cart",
    timestamps: true
})
export default class Cart extends Model implements CartInterface{

    @AutoIncrement
    @PrimaryKey
    @Column(DataType.INTEGER)
    id?: number;

    @ForeignKey(() => User)
    @AllowNull(false)
    @NotEmpty
    @Column(DataType.STRING)
    userId!: string;
    
    @ForeignKey(() => Template)
    @AllowNull(false)
    @NotEmpty
    @Column(DataType.STRING)
    templateId!: string;
    
}