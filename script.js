function createNode(element) {
    return document.createElement(element);
}

function append(parent, child) {
    return parent.appendChild(child);
}
//Aync function that deletes previous content and adds new one
async function buscar(){
    document.getElementById("notfound").innerHTML=""
    document.getElementById("id_div").innerHTML=""
    data = await searchapi(document.getElementById("tipo").value)
    return data
}
//Function that creates individual cards
function createcard(element){
    let card = createNode("div")
    card.setAttribute("id", element.id)
    card.classList.add(
        "border",
        "border-gray-600",
        "rounded",
    )
    
    //Creates a field of image if the weapon has an image, if not a default not found image will be displayed
    if (element.assets == "" || element.assets == null || element.assets.image == null ) {
        let nophoto = createNode("img")
        nophoto.setAttribute("src", "notfound.webp")
        append(card, nophoto)
        append(card, createNode("hr"))
    } else {
        let img = createNode("img")
        img.setAttribute("src", element.assets.image) 
        append(card, img)
        append(card, createNode("hr"))
    }
    let lista = createNode("ul")
    lista.classList.add(
        "text-left",
        "p-6",
    )
    append(card, lista)

    //Creates a name field for the weapon (all weapons have a name)
    let nombre = createNode("li")
    nombre.classList.add(
        "font-bold"
    )
    nombre.textContent = "Nombre: " + element.name
    append(lista,nombre)


    //Creates a raw damage field to diplay base weapon damage without buffs or any other calculation nor stat
    let rawd = createNode("li")
    rawd.textContent = "Daño base: " + element.attack.raw
    append(lista,rawd)
    
    //Creates a field of elemental damage type and elemental damage if the weapon has an element, if not it will display the weapon has no element
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
    //Creates a rarity field to diplay the rarity of the weapon (the more rarity, the higher the rank the weapon is obtained)
    let damagetype = createNode("li")
    damagetype.textContent = "Tipo de daño: " + element.damageType
    append(lista,damagetype)


    //Creates a rarity field to diplay the rarity of the weapon (the more rarity, the higher the rank the weapon is obtained)
    let rarity = createNode("li")
    rarity.textContent = "Rareza: " + element.rarity
    append(lista,rarity)

    //Appends the card to the parent div where all cards are displayed
    append(document.getElementById("cards"), card)
}

//Async function that receives an array of weapons and renders them individually with a for loop
async function renderweapons(){
    let weaponsSearched = await buscar()
    if (weaponsSearched == null || weaponsSearched == "") {
        document.getElementById("notfound").textContent = "No se encontraron armas de tipo: " + document.getElementById("tipo").value 
    } else {
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



//Async function that takes a weapon type as a parameter and queriess the API to return the values searched
async function searchapi(tipo){
    document.getElementById("loading").textContent = "Loading API"
    let weapons = []
    await fetch(`https://mhw-db.com/weapons?q={"type":"${tipo}"}`)
    .then((resp) => resp.json())
    .then(function (data) {
            document.getElementById("loading").textContent = "API loaded"
            weapons = data
            // const savedweapons = new Map(
            //     [
            //     ["long-swords", filterbyweapontype(allweapons, "long-sword")],
            //     ["great-swords", filterbyweapontype(allweapons, "great-sword")],
            //     ["charge-blades", filterbyweapontype(allweapons, "charge-blade")],
            // ]);
        })
        .catch(function (error) {
            console.log(error);
        });
        return weapons
}

//Loads render weapons (Great sword) when loading the page for the first time or refreshing 
renderweapons()
