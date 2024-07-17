import Cars from "./cars";
export default class Customer {
    static customers: Customer[] = [];
    name: string = "";
    password: string = "";
    suggestedCars?: Cars[] = [];
    constructor(name: string, password: string, suggestedCars?: Cars[]) {
        this.name = name;
        this.password = password;
        this.suggestedCars = suggestedCars;
        Customer.customers.push(this);
    }
    assignSuggestedCars(arr:Cars[]){
        this.suggestedCars = arr;
    }
}