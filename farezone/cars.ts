export default class Cars{
    model:string = "";
    name:string = "";
    date:Date = new Date();
    constructor(model:string,name:string,date:Date){
        this.model = model;
        this.name = name;
        this.date = date;
        Cars.createdPool.push(this);
    }
    static createdPool:Cars[] = []; 
}
