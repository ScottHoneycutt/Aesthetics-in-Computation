"use strict"
import FastNoiseLite from 'https://unpkg.com/fastnoise-lite@1.1.0/FastNoiseLite.js';
        

//Kicks things off -SJH
const init = () => {
    //Setting up noise stuff -SJH
    let noise = new FastNoiseLite(0);
    noise.SetNoiseType(FastNoiseLite.NoiseType.OpenSimplex2);
    noise.SetFrequency(.3);
    let noiseThreshold = .3;

    //Setting up the svg and grid -SJH
    const svgSize = 100;
    createSvg(svgSize, svgSize);
    const gridSize = 50;
    const spacing = svgSize/gridSize; 

    //Generate the grid of lines with noise holes mixed in -SJH
    for (let x = 0; x < gridSize; x++){
        for (let y = 0; y < gridSize; y++){

            let noiseValue = noise.GetNoise(x, y, 1);
            let color = "black";
            //Only add the lines in spots where the noise has not exceeded noiseThreshold -SJH
            if (noiseValue < noiseThreshold){
                
                //Adjusting color value. Comment or uncomment these two lines of code for 
                //the variations -SJH
                let colorNum = (noiseValue + (2 - noiseThreshold)) * 255/2;
                color = `rgb(${colorNum}, ${colorNum}, ${colorNum})`;

                //Rendering line -SJH
                svgElement.innerHTML += addGroup(
                addLine(x * spacing, y * spacing, (x+1) * spacing, (y+1) * spacing, color, .5),
                randomNumber(0, 360), 
                (x +.5) * spacing, 
                (y+.5) * spacing);
            }
            
        }
    }
}

//Creates the SVG in the DOM -SJH
const createSvg = (width, height) => {
    document.body.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"
        width = "50%" height = "50%" viewbox = "0 0 ${width} ${height}"></svg>`;
    svgElement = document.querySelector("svg");

    //Creating the border -SJH
    addRotatedRect(0,0, width,height, 0, "black", 1);
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

//Creates a rectangle with a given stroke color and stroke width -SJH
const addRect = (x, y, width, height, color, strokeWidth) => {
    let newRect = `<rect x="${x}" y="${y}" width="${width}" height="${height}" 
        stroke="${color}" stroke-width=${strokeWidth} fill="none"/>`

    return newRect
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

    return newPolygon;
}

//Creates a line with a given stroke color and stroke width -SJH
const addLine = (x1, y1, x2, y2, color, strokeWidth) => {
    let newLine = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
    stroke="${color}" stroke-width="${strokeWidth}"/>`;
    return newLine;
}

//Creates a new group with a given translation, rotation, and scale -SJH
const addGroup = (inputString, rotation = 0, rotPointX = 0, rotPointY = 0, 
    translationX = 0, translationY = 0,
    scaleX = 1, scaleY = 1) => {
    let newGroup = 
    `<g transform = "
    rotate(${rotation}, ${rotPointX}, ${rotPointY}) 
    translate(${translationX}, ${translationY})
    scale(${scaleX}, ${scaleY})">
        ${inputString}
    </g>`;
    return newGroup;
}

//Creates a new polgyline string using the array of specified points -SJH
const addPolyLine = (pointArray, color, strokeWidth) =>{
    let newPolyLine = `<polygon points = "`;

    //Add all the points to the polygon -SJH
    for (let point of pointArray) {
        newPolyLine += point + " ";
    }

    //Then finish off the other properties -SJH
    newPolyLine += `" stroke="${color}" stroke-width="${strokeWidth}" fill="none"/>`;

    return newPolyLine;
}

//Creates a new Path string using the specified input string -SJH
const addPath = (inputString, color, strokeWidth) => {
    let newPath = `<path d="${inputString}" stroke-width="${strokeWidth}" stroke="${color}"/>`;

    return newPath
}

//Recursive method that generates a bunch of quadrilateral polygons like in the Desordres art 
//piece -SJH
const generateDesOrdresPolygon = (x, y, width, height, minRandom, maxRandom, 
    shrinkAmmount, recurseCount, strokeWidth, color) => {
    let pointArray = [
        `${x + randomNumber(minRandom, maxRandom)}, ${y + randomNumber(minRandom, maxRandom)}`,
        `${x + randomNumber(minRandom, maxRandom) + width}, ${y+randomNumber(minRandom, maxRandom)}`,
        `${x + randomNumber(minRandom, maxRandom) + width}, ${y+randomNumber(minRandom, maxRandom) + height}`,
        `${x + randomNumber(minRandom, maxRandom)}, ${y+randomNumber(minRandom, maxRandom) + height}`];
    
    //Adjust values before recursing -SJH
    x+=shrinkAmmount;
    y+=shrinkAmmount;
    minRandom += shrinkAmmount/width;
    maxRandom -= shrinkAmmount/width;
    width-=shrinkAmmount*2;
    height-=shrinkAmmount*2; 
    recurseCount--;

    //Base case -SJH
    if (recurseCount <= 0 ||
        width < maxRandom || 
        height < maxRandom || 
        minRandom > maxRandom) {
        return addPolygon(pointArray, color, strokeWidth);
    }
    //Recursive case. Make another polygon inside this one -SJH
    else {
        return addPolygon(pointArray, color, strokeWidth) + 
            generateDesOrdresPolygon(x, y, width, height, minRandom, maxRandom, 
            shrinkAmmount, recurseCount, strokeWidth, color);
    }
    
} 

//Generates a random number between min (inclusive) and max (exclusive) -SJH
const randomNumber = (min, max) => {
    return (Math.random() * (max - min)) + min;
} 

let svgElement;
init();