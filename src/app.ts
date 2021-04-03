import express, { Application, Request, Response, NextFunction } from "express";
const app: Application = express();
import db from "./database";
const cors = require("cors");
import bodyParser from "body-parser";


app.use(cors());
app.options('*', cors());
// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.get("/", (req, res) => {
    res.json({ message: "Welcome to stejedda application." });
});
db.authenticate().then(() => {
    db.sync();
}).catch((e: any) => {
    console.log(e.message)
})
require('./routes/auth.routes')(app)
require('./routes/user.routes')(app)
require('./routes/template.routes')(app)

app.listen(8080, () => {
    console.log("app running at http://localhost:8080");
})