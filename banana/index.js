import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());

class Group {
    static regesteredUsers = {};
    static groups = [];
    length = 0;
    counter = 0;
    users = [];
    static regesterUser(user) {
        if (this.regesteredUsers[user]) {
            throw "user already Exist";
        } else if (!user) {
            throw "user is not defined";
        } else {
            if (this.groups.length === 0 || this.groups[this.groups.length - 1].length === 2) {
                let group = new Group();
                group.users.push(user);
                this.regesteredUsers[user] = this.groups.push(group);
                group.length++;
            } else if (this.groups[this.groups.length - 1].length < 2) {
                this.regesteredUsers[user] = this.groups.length;
                this.groups[this.groups.length - 1].users.push(user);
                this.groups[this.groups.length - 1].length++;
            }
        }
    }
    static count(name) {
        let groupIndex = this.regesteredUsers[name] - 1;
        let group = this.groups[groupIndex];
        group.counter++;
    }

}

// /**@type  */
// app.get("/", (req, res) => {

// });
let port = 1000;
app.listen(port,()=>{
    console.log("http://localhost:"+port);
})
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"./front.html"));
})
app.get("/name", (req, res) => {
    let username = req.query.name;
    if (username) {
        if (Group.regesteredUsers[username] === undefined) {
            Group.regesterUser(username);
        } else {
            res.status(409);
            res.json({ reason: "repeated username" });
        }
    }else{
        res.status(400);
        res.json({reason:"username is required"});
    }
    res.status(200);
    res.json({reason:"fulfiled"});
});
app.get("/count",(req,res)=>{
    let username = req.query.name;
    if (username) {
        if (Group.regesteredUsers[username] === undefined) {
            res.status(401);
            res.json({ reason: "username not registered please register username!" });
        } else {
            Group.count(username);
        }
    }else{
        res.status(400);
        res.json({reason:"username is required"});
    }
    res.status(200);
    res.json({reason:"fulfiled"});
});
app.get("/show",(req,res)=>{
    res.status(200);
    res.json(Group.groups);
})