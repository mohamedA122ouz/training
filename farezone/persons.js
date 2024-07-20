"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = exports.Customer = exports.Person = void 0;
var Person = /** @class */ (function () {
    function Person(name, password) {
        this.name = "";
        this.password = "";
        this.name = name;
        this.password = password;
    }
    return Person;
}());
exports.Person = Person;
var Admin = /** @class */ (function (_super) {
    __extends(Admin, _super);
    function Admin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Admin.prototype.createUser = function (userName, password) {
        var customer = new Customer(userName, password);
    };
    return Admin;
}(Person));
exports.Admin = Admin;
var Customer = /** @class */ (function (_super) {
    __extends(Customer, _super);
    function Customer(name, password, suggestedCars) {
        var _this = _super.call(this, name, password) || this;
        _this.suggestedCars = [];
        _this.suggestedCars = suggestedCars;
        Customer.customers.push(_this);
        return _this;
    }
    Customer.prototype.assignSuggestedCars = function (arr) {
        this.suggestedCars = arr;
    };
    Customer.customers = [];
    return Customer;
}(Person));
exports.Customer = Customer;
