"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function fetchData(url, method, data) {
    if (method === "GET") {
        return fetch(url);
    }
    else if (method === "POST") {
        return fetch(url, {
            body: JSON.stringify(data),
            headers: { "content-type": "application/json" },
            method: method
        });
    }
}
function getData() {
    let name = document.querySelector(".name");
    let password = document.querySelector(".password");
    let object = {
        user: { name: name === null || name === void 0 ? void 0 : name.value, password: password === null || password === void 0 ? void 0 : password.value }
    };
    return object;
}
fetchData(`${location.origin}/login`, "GET", getData());
