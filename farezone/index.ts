import express, { Request, Response, Application } from "express";
import cookieParser from "cookie-parser";
import Cars from "./cars";
import { Person, Customer, Admin, saveStructure } from "./persons";
import path from "path";
import fs from "fs";
let currentObject: saveStructure;
const filePath = path.join(__dirname,"./file.json");
const saveObject: Function = (data: saveStructure) => {
    fs.writeFileSync(filePath,JSON.stringify(data));
    console.log(JSON.stringify(data));
}
const readObject: Function = () => {
    if(fs.existsSync(filePath)){
        currentObject = JSON.parse(fs.readFileSync(filePath,"utf8"));
        console.log(currentObject);
    }else{
        let data:saveStructure= {
            Admin:new Admin("admin","admin"),
            users:Customer.customers,
            cars:Cars.createdPool
        };
        saveObject(data);
    }
}
try{
    if(!fs.existsSync(filePath))
        throw "file not exist";
}catch(ex){
    readObject();
}
const app: Application = express();
app.use(express.json());
app.use(cookieParser());
let port: number = 5000;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
export interface body {
    user: Customer;
    cars?: Cars[];
}
app.post("/login", (req: Request, res: Response) => {
    let { user }: body = req.body;
    // if(currentObject.Admin.name === user.name){
    //     if(currentObject.Admin.password === user.password){
    //         res.cookie("token","user123");
    //     }
    // }
    if(user.name === "Admin"){
        if(currentObject.Admin.name === user.name){
            if(currentObject.Admin.name == user.password){
                res.cookie("userType","admin");
                res.cookie("userIndex","-1");
            }
        }else {
        }
    }
});



///front end controller
app.get("/home",(req,res)=>{
    
    res.status(200);
    res.sendFile(path.join(__dirname,"./login.html"));
});