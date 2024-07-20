import express, { Request, Response, Application } from "express";
import cookieParser from "cookie-parser";
import Cars from "./cars";
import { Person, Customer, Admin, saveStructure } from "./persons";
import path from "path";
import fs from "fs";

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
app.post("/login", (req: Request, res: Response) => {
    readObject()
    let { user }: body = req.body;
    let i: body = { user: req.body }
    if (!user) {
        ({ user } = i);
    }
    if (user && user.name === "admin") {
        if (currentObject.Admin.name === user.name) {
            if (currentObject.Admin.name == user.password) {
                res.cookie("userType", "admin");
                res.cookie("userIndex", "-1");
                res.status(200);
                res.sendFile(path.join(__dirname, "./insertUsers.html"));
            }
        }
    }
    else {
        let index = -1;
        currentObject.users.forEach((el, i) => {
            if (el.name === (user ?? { name: "" }).name) {
                index = i;
            }
        });
        res.cookie("userType", "user");
        res.cookie("userIndex", index);
        res.status(200);
        res.sendFile(path.join(__dirname, "./listData.html"));
    }
});



///front end controller
app.get("/login", (req, res) => {
    res.status(200);
    res.sendFile(path.join(__dirname, "./login.html"));
});
app.get("/list", (req, res) => {
    try {

        let index = req.cookies["userIndex"];
        let suggestedCars = currentObject.users[index].suggestedCars;
        res.status(200);
        res.json(suggestedCars);
    }
    catch {
        res.status(403);
    }
});
app.post("/insertuser", (req, res) => {
    let { user }: body = req.body;
    let i: body = { user: req.body }
    if (!user) {
        ({ user } = i);
    }
    insertCustomer((user ?? { name: "" }).name, (user ?? { password: "" }).password);
    res.status(200);
});
app.post("/insertcar", (req, res) => {
    let { cars }: body = req.body;
    let i: body = { cars: req.body }
    if (!cars) {
        ({ cars } = i);
    }
    insertCar((cars ?? { name: "" }).name, (cars ?? { model: "" }).model, (cars ?? { date: new Date() }).date);
    res.status(200);
    res.sendFile(path.join(__dirname, "./cars.html"));
});
app.get("/insercar", (req, res) => {
    res.status(200);
    res.sendFile(path.join(__dirname, "./cars.html"));
})
app.post("/assign", (req, res) => {
    let { cars }: body = req.body;//{cars:{...},index:userIndex(number)}
    let i: body = { cars: req.body }
    if (!cars) {
        ({ cars } = i);
    }
    let user = req.body.index;
    currentObject.users[user].assignSuggestedCars([cars ?? new Cars("", "", new Date())]);
    saveObject(currentObject);
    readObject();
    res.status(200);
});