"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Cars = /** @class */ (function () {
    function Cars(model, name, date) {
        this.model = "";
        this.name = "";
        this.date = new Date();
        this.model = model;
        this.name = name;
        this.date = date;
        Cars.createdPool.push(this);
    }
    Cars.createdPool = [];
    return Cars;
}());
exports.default = Cars;
