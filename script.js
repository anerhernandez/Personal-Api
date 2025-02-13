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


async function saveWeapon(weapon_id){
    const apisingularsearch = async () => {
        const response = await fetch(`https://mhw-db.com/weapons?q={"id":"${weapon_id}"}`)
          .then((resp) => resp.json())
            return response
        }
    let weapon = await apisingularsearch()



    //If local storage doesn't exist, creates an object with weapon.type as key and inserts that weapon as value inside localstorage
   if (localStorage.getItem("desiredweapons") === null) {
    let savedweapons = {
        [weapon[0].type] : [weapon]
    }
     localStorage.setItem("desiredweapons", JSON.stringify(savedweapons));
     //If localstorage does exist saves it inside a variable
   }else{

    let savedweapons = JSON.parse(localStorage.getItem("desiredweapons"));

    //Checks if the weapon type matches an existing key inside the object and if it does, inserts that weapon to that key
    if ((Object.keys(savedweapons)).includes(weapon[0].type)) {
        savedweapons[weapon[0].type].push(weapon)
        localStorage.setItem("desiredweapons", JSON.stringify(savedweapons));
    //Inserts a ney key with weapon.type as key and also inserts that weapon paired to that key
    } else {
        Object.assign(savedweapons, { [weapon[0].type]: [weapon] });
        localStorage.setItem("desiredweapons", JSON.stringify(savedweapons));
    }
   }
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
        "p-9",
        "list-disc"
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

    //Creates a field of Durability and its stats dependingon color. If the weapon has no durability, such as bow, it will display None
    if (element.durability == null || element.durability[5] == null || element.durability[5] == "" ) {
        let durabilidad = createNode("li")
        durabilidad.textContent = "Durabilidad: None"
        append(lista, durabilidad)
    } else {
        let durabilidad = createNode("li")
        durabilidad.innerHTML = "Durabilidad (colores): Rojo: <i style='color:red;'>" + element.durability[5].red + "</i></i><br>Naranja: <i style='color:orange;'>" + element.durability[5].orange + "</i><br>Amarillo: <i style='color:goldenrod;'>" + element.durability[5].yellow + "</i><br>Verde: <i style='color:green;'>" + element.durability[5].green + "</i><br>Azul: <i style='color:blue;'>" + element.durability[5].blue + "</i>"
        append(lista, durabilidad)
    }
    //Creates a rarity field to diplay the rarity of the weapon (the more rarity, the higher the rank the weapon is obtained)
    let damagetype = createNode("li")
    damagetype.textContent = "Tipo de daño: " + element.damageType
    append(lista,damagetype)


    //Creates a rarity field to diplay the rarity of the weapon (the more rarity, the higher the rank the weapon is obtained)
    let rarity = createNode("li")
    rarity.textContent = "Rareza: " + element.rarity
    append(lista,rarity)

    append(card, createNode("hr"))

    let button = createNode("button")
    button.setAttribute("id", element.id)
    button.setAttribute("value", element.id)
    button.setAttribute("name", "addweapon")
    button.setAttribute("onclick", `saveWeapon(${element.id})`)
    button.classList.add(
        "border",
        "border-2",
        "p-2"

    )
    button.textContent = "Añadir a equipo deseado"
    append(lista,button)
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
            "2xl:grid-cols-3",
            "gap-5"
        )
        
        append(document.getElementById("id_div"), cards)
        
        //Use of map to generate all cards of weaponsSearched's length
        weaponsSearched.map(function (element) {
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
        })
        .catch(function (error) {
            console.log(error);
        });
        return weapons
}

//Loads render weapons (Great sword) when loading the page for the first time or refreshing 
renderweapons()



//Filter for weapons (saved in localstorage )with rarity above or equal to 5
if (localStorage.getItem("desiredweapons") != null) {
    let weaponsobject = JSON.parse(localStorage.getItem("desiredweapons"))
    let weapons = Object.values(weaponsobject)

    console.log(weapons)
    weapons.forEach(function(weaponkey) {
        weaponkey.forEach(function(weaponkey){
            if (weaponkey.filter((weapon) => weapon.rarity >=5).length != 0) {
                console.log(weaponkey)
            }
        })
    })
}
