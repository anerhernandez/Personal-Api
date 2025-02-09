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
    document.getElementById("notfound").innerHTML=""
    document.getElementById("id_div").innerHTML=""
    return filterbyweapontype(JSON.parse(localStorage.getItem("weapons")), document.getElementById("tipo").value)
}

function createcard(element){
    let card = createNode("div")
    card.setAttribute("id", element.id)
    card.classList.add(
        "border",
        "border-gray-600",
        "rounded",
    )
    
    if (element.assets == "" || element.assets == null || element.assets.image == null ) {
        let nophoto = createNode("li")
        nophoto.textContent = "No se han encontrado imagenes de este arma: " + element.name
        append(card, nophoto)
        append(card, createNode("hr"))
    } else {
        let img = createNode("img")
        img.setAttribute("src", element.assets.image) 
        append(card, img)
        append(card, createNode("hr"))
    }
    let lista = createNode("ul")
    append(card, lista)


    let nombre = createNode("li")
    nombre.textContent = "Nombre: " + element.name
    append(lista,nombre)


    if (element.elements[0] == "" || element.elements[0] == null || element.elements[0].type == null ) {
        let elemento = createNode("li")
        elemento.textContent = "Elemento: Sin elemento"

        append(lista, elemento)
    } else {
        let elemento = createNode("li")
        elemento.textContent = "Elemento: " + element.elements[0].type

        append(lista, elemento)

        let elementodmg = createNode("li")
        elementodmg.textContent = " Daño de elemento: " + element.elements[0].damage
        append(lista, elementodmg)
    }
    append(document.getElementById("cards"), card)
}


function renderweapons(){
    let weaponsSearched = buscar()
    if (weaponsSearched == null || weaponsSearched == "") {
        document.getElementById("notfound").textContent = "No se encontraron armas de tipo: " + document.getElementById("tipo").value 
    } else {
        console.log(weaponsSearched)
        let cards = createNode("div")
        cards.setAttribute('id', "cards")
        cards.classList.add(
            "grid",
            "grid-cols-1",
            "md:grid-cols-2",
            "lg:grid-cols-3",
            "gap-5"
        )
        
        append(document.getElementById("id_div"), cards)
        weaponsSearched.forEach(element => {
            createcard(element)
        });
    }
}

if (localStorage.getItem("weapons") === null) {
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
}