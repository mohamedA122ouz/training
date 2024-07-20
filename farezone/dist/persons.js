"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = exports.Customer = exports.Person = void 0;
class Person {
    constructor(name, password) {
        this.name = "";
        this.password = "";
        this.name = name;
        this.password = password;
    }
}
exports.Person = Person;
class Admin extends Person {
    createUser(userName, password) {
        let customer = new Customer(userName, password);
    }
}
exports.Admin = Admin;
class Customer extends Person {
    constructor(name, password, suggestedCars) {
        super(name, password);
        this.suggestedCars = [];
        this.suggestedCars = suggestedCars;
        Customer.customers.push(this);
    }
    assignSuggestedCars(arr) {
        this.suggestedCars = arr;
    }
}
exports.Customer = Customer;
Customer.customers = [];
