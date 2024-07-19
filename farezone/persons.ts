import Cars from "./cars";

class Person{
    name: string = "";
    password: string = "";
    constructor(name:string,password:string){
        this.name = name
        this.password = password;
    }
}

class Admin extends Person{
    createUser(userName:string,password:string){
        let customer:Customer = new Customer(userName,password);
    }
}

class Customer extends Person {
    static customers: Customer[] = [];
    suggestedCars?: Cars[] = [];
    constructor(name: string, password: string, suggestedCars?: Cars[]) {
        super(name,password);
        this.suggestedCars = suggestedCars;
        Customer.customers.push(this);
    }
    assignSuggestedCars(arr:Cars[]){
        this.suggestedCars = arr;
    }
}
interface saveStructure{
    Admin:Admin;
    users:Customer[];
    cars:Cars[];
}
export {Person,Customer,Admin,saveStructure};