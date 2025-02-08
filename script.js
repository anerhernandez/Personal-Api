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
function buscar(){
    console.log(filterbyweapontype(JSON.parse(localStorage.getItem("weapons")), document.getElementById("tipo").value))
}
if (localStorage.getItem("weapons") == null) {
    document.getElementById("loading").textContent = "Loading API"
    fetch(API)
    .then((resp) => resp.json())
    .then(function (data) {
            document.getElementById("loading").textContent = "API loaded"
    
            
            const allweapons = data
    
            // const savedweapons = new Map(
            //     [
            //     ["long-swords", filterbyweapontype(allweapons, "long-sword")],
            //     ["great-swords", filterbyweapontype(allweapons, "great-sword")],
            //     ["charge-blades", filterbyweapontype(allweapons, "charge-blade")],
            // ]);
            localStorage.setItem("weapons", JSON.stringify(allweapons))
        })
        .catch(function (error) {
            console.log(error);
        });
}else{
    document.getElementById("loading").textContent = "API loaded"
    // let weapons = JSON.parse (localStorage.getItem("weapons"))
    // console.log(weapons)
}