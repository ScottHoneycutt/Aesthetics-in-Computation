"use strict"

//Kicks things off -SJH
const init = () => {
    createSvg();

    //Test code for each primitive method -SJH---------------------------------------------------------------
    // addRotatedRect(50,50, 20,20, 20, "red", 10);
    // addCircle(70,20, 20, "blue", 4);
    // addRotatedEllipse(70,70, 5,15, 70, "green", 3);
    // let pointArray = [`10,20`, `30,20`, `70,10`]
    // addPolygon(pointArray, "black", 1);
    // addLine(60,65, 90,20, "Yellow", 6);

    //Recreation of Sainte Victoire En Rouge -SJH--------------------------------------------------
    //Purple(ish) -SJH
    // addRotatedRect(15,13, 10,10, -25, "rgb(64, 26, 41)", 10);
    // addRotatedRect(40,50, 10,10, -20, "rgb(64, 26, 41)", 10);
    // addRotatedRect(52,45, 10,10, 6, "rgb(64, 26, 41)", 10);

    // //Dark Red -SJH
    // addRotatedRect(30,10, 10,10, -3, "rgb(194, 38, 33)", 10);
    // addRotatedRect(8,37, 10,10, 4, "rgb(194, 38, 33)", 10);
    // addRotatedRect(48,68, 10,10, -45, "rgb(194, 38, 33)", 10);

    // //Light Red -SJH
    // addRotatedRect(12,30, 10,10, -45, "rgb(230, 65, 60)", 10);
    // addRotatedRect(40,28, 10,10, -6, "rgb(230, 65, 60)", 10);
    // addRotatedRect(65,65, 10,10, 20, "rgb(230, 65, 60)", 10);

    //Modified recreation of Sainte Victoire En Rouge -SJH ----------------------------------------
    //Purple(ish) -SJH
    addFadeRect(15,13, 10,10, -25, 64,26,41, 10);
    addFadeRect(40,50, 10,10, -20, 64,26,41, 10);
    addFadeRect(52,45, 10,10, 6, 64,26,41, 10);

    //Dark Red -SJH
    addFadeRect(30,10, 10,10, -3, 194,38,33, 10);
    addFadeRect(8,37, 10,10, 4, 194,38,33, 10);
    addFadeRect(48,68, 10,10, -45, 194,38,33, 10);

    //Light Red -SJH
    addFadeRect(12,30, 10,10, -45, 230,65,60, 10);
    addFadeRect(40,28, 10,10, -6, 230,65,60, 10);
    addFadeRect(65,65, 10,10, 20, 230,65,60, 10);
}

//Creates the SVG in the DOM -SJH
const createSvg = () => {
    document.body.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"
        width = "50%" height = "50%" viewbox = "0 0 85 85"></svg>`;
    svgElement = document.querySelector("svg");

    //Creating the border -SJH
    addRotatedRect(0,0, 85,85, 0, "black", 1);
}

//Creates a rectangle with a given rotation, stroke color, and stroke width -SJH
const addRotatedRect = (x, y, width, height, rotation, color, strokeWidth) => {
    let newGroup = 
    `<g transform = "rotate(${rotation}, ${x}, ${y})">
        <rect x="${x}" y="${y}" width="${width}" height="${height}" 
        stroke="${color}" stroke-width=${strokeWidth} fill="none"/>
    </g>`;
    svgElement.innerHTML += newGroup;
}

//The same as addRotatedRect, but adds a fade effect to each rect. Creates smaller rects 
//inside each rect. -SJH
const addFadeRect = (x, y, width, height, rotation, r, g, b, strokeWidth) => {
    let newGroup = 
    `<g transform = "rotate(${rotation}, ${x}, ${y})">` 
    + fadeRectString(x, y, width, height, rotation, r, g, b, strokeWidth); +
    `</g>`

    svgElement.innerHTML += newGroup;
}

//Recursive method used to generate the string for color fade in a rectangle -SJH
const fadeRectString = (x, y, width, height, rotation, r, g, b, strokeWidth) =>{
    //Base case -SJH
    if (width <= 0 || height <= 0) {
        return "";
    }
    //Recursive case -SJH
    else {
        let currentRect = `<rect x="${x}" y="${y}" width="${width}" height="${height}" 
        stroke="rgb(${r}, ${g}, ${b})" stroke-width=${strokeWidth} fill="none"/>`;

        //Modify the color and size -SJH
        if (r<254) {
            r+=2;
        }
        if (g<254) {
            g+=2
        }
        if (b<254) {
            b+=2
        }
        if (strokeWidth > 1){
            strokeWidth--;
        }
        else{
            x+=.5;
            y+=.5;
            width-=1;
            height-=1;
        }

        //Recurse -SJH
        return currentRect + fadeRectString(x, y, width, height, rotation, r, g, b, strokeWidth); 
    }
}

//Creates a circle with a given stroke color and stroke width -SJH
const addCircle = (centerX, centerY, radius, color, strokeWidth) => {
    let newCircle = `<circle cx="${centerX}" cy="${centerY}" r="${radius}" 
    stroke="${color}" stroke-width="${strokeWidth}" fill="none"/>`;
    svgElement.innerHTML += newCircle;
}

//Creates an ellipse with a given rotation, stroke color, and stroke width -SJH
const addRotatedEllipse = (centerX, centerY, radiusX, radiusY, rotation, color, strokeWidth) => {
    let newEllipse = 
    `<g transform = "rotate(${rotation}, ${centerX}, ${centerY})">
        <ellipse cx="${centerX}" cy="${centerY}" rx="${radiusX}" ry=${radiusY}
        stroke="${color}" stroke-width="${strokeWidth}" fill="none"/>
    </g>`;
    svgElement.innerHTML += newEllipse;
}

//Creates a polygon with the specified point array, stroke color, and stroke width -SJH
const addPolygon = (pointArray, color, strokeWidth) => {
    let newPolygon = `<polygon points = "`;

    //Add all the points to the polygon -SJH
    for (let point of pointArray) {
        newPolygon += point + " ";
    }

    //Then finish off the other properties -SJH
    newPolygon += `" stroke="${color}" stroke-width="${strokeWidth}" fill="none"/>`;

    svgElement.innerHTML += newPolygon;
}

//Creates a line with a given stroke color and stroke width -SJH
const addLine = (x1, y1, x2, y2, color, strokeWidth) => {
    let newLine = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
    stroke="${color}" stroke-width="${strokeWidth}"/>`;
    svgElement.innerHTML += newLine;
}


let svgElement;
init();