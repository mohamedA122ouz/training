"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const database_1 = __importDefault(require("./database"));
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
// app.post("/login", (req: Request, res: Response) => {
//     readObject()
//     let { user }: body = req.body;
//     let i: body = { user: req.body }
//     if (!user) {
//         ({ user } = i);
//     }
//     if (user && user.name === "admin") {
//         if (currentObject.Admin.name === user.name) {
//             if (currentObject.Admin.name == user.password) {
//                 res.cookie("userType", "admin");
//                 res.cookie("userIndex", "-1");
//                 res.status(200);
//                 res.sendFile(path.join(__dirname, "./insertUsers.html"));
//             }
//         }
//     }
//     else {
//         let index = -2;
//         currentObject.users.forEach((el, i) => {
//             if (el.name === (user ?? { name: "" }).name) {
//                 index = i;
//                 res.cookie("userType", "user");
//                 res.cookie("userIndex", index);
//                 res.status(200);
//                 res.sendFile(path.join(__dirname, "./listData.html"));
//             }
//         });
//         if (index === -2) {
//             res.clearCookie("userType");
//             res.clearCookie("userIndex");
//             res.status(404);
//             res.send(`<h1>user not found 404</h1>`);
//         }
//     }
// });
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // readObject()
    let { user } = req.body;
    let i = { user: req.body };
    if (!user) {
        ({ user } = i);
    }
    if (yield database_1.default.login((user !== null && user !== void 0 ? user : { name: "" }).name, (user !== null && user !== void 0 ? user : { password: "" }).password)) {
        let currentUser = yield database_1.default.getUserByName((user !== null && user !== void 0 ? user : { name: "" }).name);
        let index = currentUser[0].id;
        if (currentUser[0].isAdmin === 1) {
            index = -1;
        }
        res.cookie("userType", "user");
        res.cookie("userIndex", index);
        if (index === -1) {
            res.status(200);
            res.sendFile(path_1.default.join(__dirname, "./insertUsers.html"));
        }
        else if (currentUser[0].isFirstTime) {
            res.status(200);
            res.sendFile(path_1.default.join(__dirname, "./resetPassword.html"));
        }
        else {
            res.status(200);
            res.sendFile(path_1.default.join(__dirname, "./listData.html"));
        }
    }
    else {
        res.clearCookie("userType");
        res.clearCookie("userIndex");
        res.status(404);
        res.send(`<h1>user not found 404</h1>`);
    }
}));
///front end controller
app.get("/login", (req, res) => {
    res.status(200);
    res.sendFile(path_1.default.join(__dirname, "./login.html"));
});
app.get("/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let index = req.cookies["userIndex"];
        // let suggestedCars = currentObject.users[index].suggestedCars;
        let suggestedCars = yield database_1.default.listSuggestedCars(index);
        res.status(200);
        res.json(suggestedCars);
    }
    catch (_a) {
        res.status(403);
    }
}));
app.post("/insertuser", (req, res) => {
    if (req.cookies["userIndex"] === "-1") {
        let { user } = req.body;
        let i = { user: req.body };
        if (!user) {
            ({ user } = i);
        }
        // insertCustomer((user ?? { name: "" }).name, (user ?? { password: "" }).password);
        database_1.default.insertUser((user !== null && user !== void 0 ? user : { name: "" }).name, (user !== null && user !== void 0 ? user : { password: "" }).password);
        res.status(200);
        res.sendFile(path_1.default.join(__dirname, "./insertUsers.html"));
    }
    else {
        res.status(403);
        res.send(`<h1>not allowed</h1>`);
    }
});
app.post("/insertcar", (req, res) => {
    if (req.cookies["userIndex"] === "-1") {
        let { cars } = req.body;
        let i = { cars: req.body };
        if (!cars) {
            ({ cars } = i);
        }
        // insertCar((cars ?? { name: "" }).name, (cars ?? { model: "" }).model, (cars ?? { date: new Date() }).date);
        database_1.default.insertCar((cars !== null && cars !== void 0 ? cars : { name: "" }).name, (cars !== null && cars !== void 0 ? cars : { model: "" }).model, (cars !== null && cars !== void 0 ? cars : { date: new Date() }).date);
        res.status(200);
        res.sendFile(path_1.default.join(__dirname, "./cars.html"));
    }
    else {
        res.status(403);
        res.send(`<h1>not allowed</h1>`);
    }
});
app.get("/insercar", (req, res) => {
    if (req.cookies["userIndex"] === "-1") {
        res.status(200);
        res.sendFile(path_1.default.join(__dirname, "./cars.html"));
    }
    else {
        res.status(403);
        res.send(`<h1>not allowed</h1>`);
    }
});
app.post("/assign", (req, res) => {
    if (req.cookies["userIndex"] === "-1") {
        // readObject();
        let user = parseInt(req.body.useri);
        let car = parseInt(req.body.cari);
        // currentObject.users[user]["suggestedCars"] = ([...(currentObject.users[user]["suggestedCars"] ?? []), currentObject.cars[car]]);
        // saveObject(currentObject);
        // readObject();
        database_1.default.assign(user, car);
        res.status(200);
        res.sendFile(path_1.default.join(__dirname, "./assignCar.html"));
    }
    else {
        res.status(403);
        res.send(`<h1>not allowed</h1>`);
    }
});
app.get("/userandcars", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // readObject();
    let carsArr = yield database_1.default.listCars();
    let usersArr = yield database_1.default.listUsers();
    usersArr.shift(); //removeing admin from the array of users
    res.status(200);
    // res.json({ cars: currentObject.cars, users: currentObject.users });
    res.json({ cars: carsArr, users: usersArr });
}));
app.get("/assigncar", (req, res) => {
    if (req.cookies["userIndex"] === "-1") {
        res.status(200);
        res.sendFile(path_1.default.join(__dirname, "./assignCar.html"));
    }
    else {
        res.status(403);
        res.send(`<h1>not allowed</h1>`);
    }
});
app.get("/changePassword", (req, res) => {
    res.status(200);
    res.sendFile(path_1.default.join(__dirname, "./resetPassword.html"));
});
app.post("/changePassword", (req, res) => {
    let userIndex = req.cookies["userIndex"];
    let newPassword = req.body.password;
    database_1.default.changePassword(userIndex, newPassword);
    res.status(200);
    res.sendFile(path_1.default.join(__dirname, "./login.html"));
});
