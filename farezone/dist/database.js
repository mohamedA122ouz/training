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
const password_hash_1 = require("password-hash");
const connectoin_1 = __importDefault(require("./connectoin"));
class database {
    static executeQuery(statement, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            let data;
            try {
                data = new Promise((acc, rej) => {
                    connectoin_1.default.query(statement, (parameters !== null && parameters !== void 0 ? parameters : []), (err, result) => {
                        if (err) {
                            rej(false);
                        }
                        else {
                            acc(true);
                            console.log(result);
                        }
                    });
                });
                return yield data;
            }
            catch (ex) {
                console.log(ex.message);
                return false;
            }
        });
    }
    static getValues(statement, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            let data;
            try {
                data = new Promise((acc, rej) => {
                    connectoin_1.default.query(statement, (parameters !== null && parameters !== void 0 ? parameters : []), (err, result) => {
                        if (err) {
                            rej([]);
                        }
                        else {
                            acc(result);
                            console.log(result);
                        }
                    });
                });
                return yield data;
            }
            catch (ex) {
                console.log(ex.message);
                return [];
            }
        });
    }
    static listUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            let statment = "SELECT * FROM user;";
            return yield this.getValues(statment);
        });
    }
    static listCars() {
        return __awaiter(this, void 0, void 0, function* () {
            let statment = "SELECT * FROM car;";
            return yield this.getValues(statment);
        });
    }
    static listSuggestedCars(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let statment = "SELECT c.name FROM car c RIGHT JOIN suggestedcars sc ON sc.uId = ? AND sc.cId = c.id";
            let data = yield this.getValues(statment, [id]);
            return data;
        });
    }
    static insertUser(name, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let hashedPassword = (0, password_hash_1.generate)(password);
            console.log(hashedPassword);
            let statement = "CALL createUser(?,?)";
            return yield this.executeQuery(statement, [name, hashedPassword]);
        });
    }
    static insertCar(name, model, date) {
        return __awaiter(this, void 0, void 0, function* () {
            let statement = "CALL createCar(?,?,?)";
            return yield this.executeQuery(statement, [name, date, model]);
        });
    }
    static login(name, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let statement = "SELECT * FROM user u WHERE u.name = ?";
            let user = yield this.getValues(statement, [name]);
            if ((0, password_hash_1.verify)(password, user[0].password)) {
                return true;
            }
            return false;
        });
    }
    static getUserByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let statement = "SELECT * FROM user u WHERE u.name = ?";
            let user = yield this.getValues(statement, [name]);
            return user;
        });
    }
    static assign(uId, cId) {
        return __awaiter(this, void 0, void 0, function* () {
            let statement = "INSERT suggestedcars(uId,cId,uniqueHelper) VALUES(?,?,?)";
            yield this.executeQuery(statement, [uId, cId, `${uId}${cId}`]);
        });
    }
    static changePassword(uId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let statement = "CALL changePassByUser(?,?)";
            let hashedPassword = (0, password_hash_1.generate)(password);
            yield this.executeQuery(statement, [hashedPassword, uId]);
        });
    }
}
exports.default = database;
