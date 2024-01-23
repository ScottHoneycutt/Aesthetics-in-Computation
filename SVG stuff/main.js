"use strict"

//Kicks things off -SJH
const init = () => {

}

//Creates the SVG in the DOM -SJH
const createSvg = () => {
    document.body.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"
        width = "100%" height = "100%" viewbox = "0 0 100 100"></svg>`;
    svgElement = document.querySelector("svg");
}

//Adds a rectangle with a given rotation 
const addRotatedRect = (x, y, width, height, rotation) => {
    let newGroup = `<g></g>`
    svgElement.appendChild();
}
//<g transform="rotate(1, 20, 30)"></g>

let svgElement;
init();