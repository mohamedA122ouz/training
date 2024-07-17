import express from "express";

const app = express();
app.use(express.json());
let port: number = 5000;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
app.get("/admin",(req,res)=>{
    req.headers["cookie"] = "welcome:hello world";
    res.status(200);
    res.send({name:__dirname});
});