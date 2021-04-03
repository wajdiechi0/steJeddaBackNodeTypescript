import { Sequelize } from "sequelize-typescript";
const db = new Sequelize('stejedda', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    port: 8889,
    models: [__dirname + '/models']
});

export default db;