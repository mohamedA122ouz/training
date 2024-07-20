"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cars_1 = __importDefault(require("./cars"));
const persons_1 = require("./persons");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
let currentObject;
const filePath = path_1.default.join(__dirname, "./file.json");
const saveObject = (data) => {
    fs_1.default.writeFileSync(filePath, JSON.stringify(data));
    console.log(JSON.stringify(data));
};
const readObject = () => {
    if (fs_1.default.existsSync(filePath)) {
        currentObject = JSON.parse(fs_1.default.readFileSync(filePath, "utf8"));
        console.log(currentObject);
    }
    else {
        let data = {
            Admin: new persons_1.Admin("admin", "admin"),
            users: persons_1.Customer.customers,
            cars: cars_1.default.createdPool
        };
        saveObject(data);
    }
};
try {
    if (!fs_1.default.existsSync(filePath))
        throw "file not exist";
}
catch (ex) {
    readObject();
}
function insertCar(name, model, date) {
    let car = new cars_1.default(model, name, date);
    readObject();
    currentObject.cars.push(car);
    saveObject(currentObject);
}
function insertCustomer(name, password) {
    let user = new persons_1.Customer(name, password);
    readObject();
    currentObject.users.push(user);
    saveObject(currentObject);
}
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
let port = 5000;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
app.post("/login", (req, res) => {
    readObject();
    let { user } = req.body;
    let i = { user: req.body };
    if (!user) {
        ({ user } = i);
    }
    if (user && user.name === "admin") {
        if (currentObject.Admin.name === user.name) {
            if (currentObject.Admin.name == user.password) {
                res.cookie("userType", "admin");
                res.cookie("userIndex", "-1");
                res.status(200);
                res.sendFile(path_1.default.join(__dirname, "./insertUsers.html"));
            }
        }
    }
    else {
        let index = -1;
        currentObject.users.forEach((el, i) => {
            if (el.name === (user !== null && user !== void 0 ? user : { name: "" }).name) {
                index = i;
            }
        });
        res.cookie("userType", "user");
        res.cookie("userIndex", index);
        res.status(200);
        res.sendFile(path_1.default.join(__dirname, "./listData.html"));
    }
});
///front end controller
app.get("/login", (req, res) => {
    res.status(200);
    res.sendFile(path_1.default.join(__dirname, "./login.html"));
});
app.get("/list", (req, res) => {
    try {
        let index = req.cookies["userIndex"];
        let suggestedCars = currentObject.users[index].suggestedCars;
        res.status(200);
        res.json(suggestedCars);
    }
    catch (_a) {
        res.status(403);
    }
});
app.post("/insertuser", (req, res) => {
    let { user } = req.body;
    let i = { user: req.body };
    if (!user) {
        ({ user } = i);
    }
    insertCustomer((user !== null && user !== void 0 ? user : { name: "" }).name, (user !== null && user !== void 0 ? user : { password: "" }).password);
    res.status(200);
});
app.post("/insertcar", (req, res) => {
    let { cars } = req.body;
    let i = { cars: req.body };
    if (!cars) {
        ({ cars } = i);
    }
    insertCar((cars !== null && cars !== void 0 ? cars : { name: "" }).name, (cars !== null && cars !== void 0 ? cars : { model: "" }).model, (cars !== null && cars !== void 0 ? cars : { date: new Date() }).date);
    res.status(200);
    res.sendFile(path_1.default.join(__dirname, "./cars.html"));
});
app.get("/insercar", (req, res) => {
    res.status(200);
    res.sendFile(path_1.default.join(__dirname, "./cars.html"));
});
app.post("/assign", (req, res) => {
    let { cars } = req.body; //{cars:{...},index:userIndex(number)}
    let i = { cars: req.body };
    if (!cars) {
        ({ cars } = i);
    }
    let user = req.body.index;
    currentObject.users[user].assignSuggestedCars([cars !== null && cars !== void 0 ? cars : new cars_1.default("", "", new Date())]);
    saveObject(currentObject);
    readObject();
    res.status(200);
});
