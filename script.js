const API = "https://mhw-db.com/weapons/";

function createNode(element) {
    return document.createElement(element);
}

function append(parent, child) {
    return parent.appendChild(child);
}

function filterbyweapontype(data, type){
    return data.filter((element) => element.type == type);
}

fetch(API)
    .then((resp) => resp.json())
    .then(function (data) {

        const allweapons = data

        const savedweapons = new Map(
            [
            ["long-swords", filterbyweapontype(allweapons, "long-sword")],
            ["great-swords", filterbyweapontype(allweapons, "great-sword")],
            ["charge-blades", filterbyweapontype(allweapons, "charge-blade")],
        ]);
        let contenedor = createNode("div")

        contenedor.textnode= "sample text"
        append(document.getElementById("id_div"), contenedor)
    })
    .catch(function (error) {
        console.log(error);
    });