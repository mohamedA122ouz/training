"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Cars {
    constructor(model, name, date) {
        this.model = "";
        this.name = "";
        this.date = new Date();
        this.model = model;
        this.name = name;
        this.date = date;
        Cars.createdPool.push(this);
    }
}
Cars.createdPool = [];
exports.default = Cars;
