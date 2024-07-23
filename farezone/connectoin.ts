import mysql from "mysql";
const connection = mysql.createConnection({host:"localhost",password:"",user:"root",database:"farezone"});
try{
    connection.connect();
}catch(ex){
    console.log(ex);
}
export default connection;