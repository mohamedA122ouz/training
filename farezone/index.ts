import express, { Request, Response, Application } from "express";
import cookieParser from "cookie-parser";
import Cars from "./cars";
import { Person, Customer, Admin, saveStructure } from "./persons";
import path from "path";
import fs from "fs";
import database from "./database";

let currentObject: saveStructure;
const filePath = path.join(__dirname, "./file.json");
const saveObject: Function = (data: saveStructure) => {
    fs.writeFileSync(filePath, JSON.stringify(data));
    console.log(JSON.stringify(data));
}
const readObject: Function = () => {
    if (fs.existsSync(filePath)) {
        currentObject = JSON.parse(fs.readFileSync(filePath, "utf8"));
        console.log(currentObject);
    } else {
        let data: saveStructure = {
            Admin: new Admin("admin", "admin"),
            users: Customer.customers,
            cars: Cars.createdPool
        };
        saveObject(data);
    }
}
try {
    if (!fs.existsSync(filePath))
        throw "file not exist";
} catch (ex) {
    readObject();
}
function insertCar(name: string, model: string, date: Date) {
    let car = new Cars(model, name, date);
    readObject();
    currentObject.cars.push(car);
    saveObject(currentObject);
}
function insertCustomer(name: string, password: string) {
    let user = new Customer(name, password);
    readObject();
    currentObject.users.push(user);
    saveObject(currentObject);
}
const app: Application = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
let port: number = 5000;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
export interface body {
    user?: Customer;
    cars?: Cars;
}
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
app.post("/login", async (req: Request, res: Response) => {
    readObject()
    let { user }: body = req.body;
    let i: body = { user: req.body }
    if (!user) {
        ({ user } = i);
    }
    if (await database.login((user ?? { name: "" }).name, (user ?? { password: "" }).password)) {
        let currentUser = await database.getUserByName((user ?? { name: "" }).name);
        let index = currentUser[0].id;
        if (currentUser[0].isAdmin === 1) {
            index = -1;
        }
        res.cookie("userType", "user");
        res.cookie("userIndex", index);
        if (index === -1) {
            res.status(200);
            res.sendFile(path.join(__dirname, "./insertUsers.html"));
        } else {
            res.status(200);
            res.sendFile(path.join(__dirname, "./listData.html"));
        }
    } else {
        res.clearCookie("userType");
        res.clearCookie("userIndex");
        res.status(404);
        res.send(`<h1>user not found 404</h1>`);
    }
});


///front end controller
app.get("/login", (req, res) => {
    res.status(200);
    res.sendFile(path.join(__dirname, "./login.html"));
});
app.get("/list", async (req, res) => {
    try {
        let index = req.cookies["userIndex"];
        // let suggestedCars = currentObject.users[index].suggestedCars;
        let suggestedCars = await database.listSuggestedCars(index);
        res.status(200);
        res.json(suggestedCars);
    }
    catch {
        res.status(403);
    }
});
app.post("/insertuser", (req, res) => {
    if (req.cookies["userIndex"] === "-1") {
        let { user }: body = req.body;
        let i: body = { user: req.body }
        if (!user) {
            ({ user } = i);
        }
        // insertCustomer((user ?? { name: "" }).name, (user ?? { password: "" }).password);
        database.insertUser((user ?? { name: "" }).name, (user ?? { password: "" }).password);
        res.status(200);
        res.sendFile(path.join(__dirname, "./insertUsers.html"));
    }
    else {

        res.status(403);
        res.send(`<h1>not allowed</h1>`);
    }
});
app.post("/insertcar", (req, res) => {
    if (req.cookies["userIndex"] === "-1") {
        let { cars }: body = req.body;
        let i: body = { cars: req.body }
        if (!cars) {
            ({ cars } = i);
        }
        // insertCar((cars ?? { name: "" }).name, (cars ?? { model: "" }).model, (cars ?? { date: new Date() }).date);
        database.insertCar((cars ?? { name: "" }).name, (cars ?? { model: "" }).model, (cars ?? { date: new Date() }).date);
        res.status(200);
        res.sendFile(path.join(__dirname, "./cars.html"));
    } else {
        res.status(403);
        res.send(`<h1>not allowed</h1>`);
    }
});
app.get("/insercar", (req, res) => {
    if (req.cookies["userIndex"] === "-1") {
        res.status(200);
        res.sendFile(path.join(__dirname, "./cars.html"));
    } else {
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
        database.assign(user, car);
        res.status(200);
        res.sendFile(path.join(__dirname, "./assignCar.html"));
    }
    else {
        res.status(403);
        res.send(`<h1>not allowed</h1>`);
    }
});
app.get("/userandcars", async (req, res) => {
    // readObject();
    let carsArr = await database.listCars();
    let usersArr = await database.listUsers();
    usersArr.shift();//removeing admin from the array of users
    res.status(200);
    // res.json({ cars: currentObject.cars, users: currentObject.users });
    res.json({ cars: carsArr, users: usersArr });
});
app.get("/assigncar", (req, res) => {
    if (req.cookies["userIndex"] === "-1") {
        res.status(200);
        res.sendFile(path.join(__dirname, "./assignCar.html"));
    } else {
        res.status(403);
        res.send(`<h1>not allowed</h1>`);
    }
});