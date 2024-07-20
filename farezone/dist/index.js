"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cookie_parser_1 = require("cookie-parser");
var cars_1 = require("../cars");
var persons_1 = require("../persons");
var path_1 = require("path");
var fs_1 = require("fs");
var currentObject;
var filePath = path_1.default.join(__dirname, "./file.json");
var saveObject = function (data) {
    fs_1.default.writeFileSync(filePath, JSON.stringify(data));
    console.log(JSON.stringify(data));
};
var readObject = function () {
    if (fs_1.default.existsSync(filePath)) {
        currentObject = JSON.parse(fs_1.default.readFileSync(filePath, "utf8"));
        console.log(currentObject);
    }
    else {
        var data = {
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
    var car = new cars_1.default(model, name, date);
    currentObject.cars.push(car);
    saveObject(currentObject);
}
function insertCustomer(name, password) {
    var user = new persons_1.Customer(name, password);
    currentObject.users.push(user);
    saveObject(currentObject);
}
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
var port = 5000;
app.listen(port, function () {
    console.log("http://localhost:".concat(port));
});
app.post("/login", function (req, res) {
    readObject();
    var user = req.body.user;
    var i = { user: req.body };
    if (!user) {
        (user = i.user);
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
        var index_1 = -1;
        currentObject.users.forEach(function (el, i) {
            if (el.name === (user !== null && user !== void 0 ? user : { name: "" }).name) {
                index_1 = i;
            }
        });
        res.cookie("userType", "user");
        res.cookie("userIndex", index_1);
        res.status(200);
        res.sendFile(path_1.default.join(__dirname, "./listData.html"));
    }
});
///front end controller
app.get("/login", function (req, res) {
    res.status(200);
    res.sendFile(path_1.default.join(__dirname, "./login.html"));
});
app.get("/list", function (req, res) {
    try {
        var index = req.cookies["userIndex"];
        var suggestedCars = currentObject.users[index].suggestedCars;
        res.status(200);
        res.json(suggestedCars);
    }
    catch (_a) {
        res.status(403);
    }
});
app.post("/insertuser", function (req, res) {
    var user = req.body.user;
    var i = { user: req.body };
    if (!user) {
        (user = i.user);
    }
    insertCustomer((user !== null && user !== void 0 ? user : { name: "" }).name, (user !== null && user !== void 0 ? user : { password: "" }).password);
    res.status(200);
});
app.post("/insertcar", function (req, res) {
    var cars = req.body.cars;
    var i = { cars: req.body };
    if (!cars) {
        (cars = i.cars);
    }
    insertCar((cars !== null && cars !== void 0 ? cars : { name: "" }).name, (cars !== null && cars !== void 0 ? cars : { model: "" }).model, (cars !== null && cars !== void 0 ? cars : { date: new Date() }).date);
    res.status(200);
});
app.post("/assign", function (req, res) {
    var cars = req.body.cars;
    var i = { cars: req.body };
    if (!cars) {
        (cars = i.cars);
    }
    var user = req.body.index;
    currentObject.users[user].assignSuggestedCars([cars !== null && cars !== void 0 ? cars : new cars_1.default("", "", new Date())]);
    saveObject(currentObject);
    readObject();
    res.status(200);
});
