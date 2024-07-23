import { generate, verify } from "password-hash";
import connection from "./connectoin";

class database{
    static async executeQuery(statement: string, parameters?: any[]) {
        let data: Promise<boolean>;
        try {
            data = new Promise((acc, rej) => {
                connection.query(statement, (parameters??[]), (err, result) => {
                    if (err) {
                        rej(false);
                    } else {
                        acc(true);
                        console.log(result);
                    }
                });
            });
            return await data;
        } catch (ex: any) {
            console.log(ex.message);
            return false;
        }
    }
    static async getValues(statement: string, parameters?: any[]):Promise<Array<any>> {
        let data: Promise<[]>;
        try {
            data = new Promise<[]>((acc, rej) => {
                connection.query(statement, (parameters??[]), (err, result:[]) => {
                    if (err) {
                        rej([]);
                    } else {
                        acc(result);
                        console.log(result);
                    }
                });
            });
            return await data;
        } catch (ex: any) {
            console.log(ex.message);
            return [];
        }
    }
    static async listUsers():Promise<Array<Object>>{
        let statment = "SELECT * FROM user;";
        return await this.getValues(statment);
    }
    static async listCars():Promise<Array<Object>>{
        let statment = "SELECT * FROM car;";
        return await this.getValues(statment);
    }
    static async listSuggestedCars(id:number):Promise<Array<Object>>{
        let statment = "SELECT c.name FROM car c RIGHT JOIN suggestedcars sc ON sc.uId = ? AND sc.cId = c.id";
        let data = await this.getValues(statment,[id]);
        return data;
    }
    static async insertUser(name:string,password:string):Promise<boolean>{
        let hashedPassword = generate(password);
        console.log(hashedPassword);
        let statement = "CALL createUser(?,?)";
        return await this.executeQuery(statement,[name,hashedPassword]);
    }
    static async insertCar(name:string,model:string,date:Date):Promise<boolean>{
        let statement = "CALL createCar(?,?,?)";
        return await this.executeQuery(statement,[name,date,model]);
    }
    static async login(name:string,password:string):Promise<true|false>{
        let statement = "SELECT * FROM user u WHERE u.name = ?";
        let user = await this.getValues(statement,[name]);
        if(verify(password,user[0].password)){
            return true;
        }
        return  false;
    }
    static async getUserByName(name:string):Promise<Array<user>>{
        let statement = "SELECT * FROM user u WHERE u.name = ?";
        let user = await this.getValues(statement,[name]);
        return user;
    }
    static async assign(uId:number,cId:number){
        let statement = "INSERT suggestedcars(uId,cId,uniqueHelper) VALUES(?,?,?)";
        await this.executeQuery(statement,[uId,cId,`${uId}${cId}`]);
    }
    static async changePassword(uId:number,password:string){
        let statement = "CALL changePassByUser(?,?)";
        let hashedPassword = generate(password);
        await this.executeQuery(statement,[hashedPassword,uId]);
    }
}
interface user{
    id:number;
    name:string;
    password:string;
    isFirstTime:0|1;
    isAdmin:0|1;
}
export default database;