import Cars from "./cars";
import { Customer } from "./persons";

let name = document.querySelector(".name");
let password = document.querySelector(".password");
export interface body {
    user: {name?:string|null,password?:string|null};
    cars?: Cars[];
}
let object:body ={
    user:{name:name?.textContent,password:password?.textContent}
};
fetch(`${location.origin}/login`,{
    body:
})