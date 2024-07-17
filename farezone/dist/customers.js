"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Customer {
    constructor(name, password, suggestedCars) {
        this.name = "";
        this.password = "";
        this.suggestedCars = [];
        this.name = name;
        this.password = password;
        this.suggestedCars = suggestedCars;
        Customer.customers.push(this);
    }
    assignSuggestedCars(arr) {
        this.suggestedCars = arr;
    }
}
Customer.customers = [];
exports.default = Customer;
