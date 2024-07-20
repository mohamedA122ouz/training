import { application } from "express";
import Cars from "./cars";
import { Customer } from "./persons";

export interface body {
    user: {name?:string|null,password?:string|null};
    cars?: Cars[];
}
function fetchData(url:string,method:"GET"|"POST",data:body){
    if(method === "GET"){
        return fetch(url);
    }
    else if(method === "POST"){
        return fetch(url,{
            body:JSON.stringify(data),
            headers:{"content-type":"application/json"},
            method:method
        });
    }
}
function getData(){

    let name:HTMLInputElement|null = document.querySelector(".name");
    let password:HTMLInputElement|null = document.querySelector(".password");
    let object:body ={
        user:{name:name?.value,password:password?.value}
    };
    return object;
}

fetchData(`${location.origin}/login`,"GET",getData());