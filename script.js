const API = "https://anapioficeandfire.com/api/houses";

function createNode(element) {
    return document.createElement(element);
}

function append(parent, child) {
    return parent.appendChild(child);
}
fetch(API)
    .then((resp) => resp.json())
    .then(function (data) {
        let houses = data
        let container = createNode("div")
        container.classList.add(
            "container"
        )
        document.body.appendChild(container)
        let div_houses = createNode("div")
        div_houses.setAttribute("id", "houses")
        div_houses.classList.add(
            "row",
            "row-cols-3"
        )
        append(container, div_houses)
        houses.map(element => {
            let div = createNode("div")
            div.textContent = element.name
            append(document.getElementById("id_div"), div)
        })
        console.log(data)
    })
    .catch(function (error) {
        console.log(error);
    });