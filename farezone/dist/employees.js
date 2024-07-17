"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customers_1 = __importDefault(require("./customers"));
class Admin {
    createUser(userName, password) {
        let customer = new customers_1.default(userName, password);
    }
}
exports.default = Admin;
class saveData {
}
