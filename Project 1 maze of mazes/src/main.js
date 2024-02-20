"use strict"
import FastNoiseLite from 'https://unpkg.com/fastnoise-lite@1.1.0/FastNoiseLite.js';
        

//Kicks things off -SJH
const init = () => {
    //Setting up noise stuff -SJH
    // let noise = new FastNoiseLite(0);
    // noise.SetNoiseType(FastNoiseLite.NoiseType.OpenSimplex2);
    // noise.SetFrequency(.3);
    // let noiseThreshold = .3;

    //Setting up the svg and grid -SJH
    const svgSize = 100;
    createSvg(svgSize, svgSize);
    const gridSize = 10;
    const spacing = svgSize/gridSize; 
    let boolGrid = make2DArray(gridSize, gridSize);
    resetBoolGrid(boolGrid, gridSize);

    svgElement.innerHTML += `<polyline points = "` 
        + createMazeTile(0, 0, boolGrid, gridSize, "black", .5); 
}

//Creates the SVG in the DOM -SJH
const createSvg = (width, height) => {
    document.body.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"
        width = "50%" height = "50%" viewbox = "0 0 ${width} ${height}"></svg>`;
    svgElement = document.querySelector("svg");

    //Creating the border -SJH
    addRotatedRect(0,0, width,height, 0, "black", 1);
}

//Resets a grid of booleans to false -SJH
const resetBoolGrid = (boolGrid, gridSize) => {
    console.log(boolGrid);
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            boolGrid[x][y] = false;
        }
    }
    
}

//Creates a 2D array with a specified size -SJH
function make2DArray(x, y) {
    let array = [];
    for (let i = 0; i < x; i++) {
        let array2 = [];
        for (let k = 0; k < y; k++){
            array2.push(false);
        }
        array.push(array2);
    }
    return array;
}

//Recursive function. Creates a maze. -SJH
const createMazeTile = (currentX, currentY, boolGrid, gridSize, color, strokeWidth) => {
    //Mark this grid tile as true (visited) -SJH
    boolGrid[currentX, currentY] = true;

    //Check how many false neighbors there are -SJH
    let falseNeighbors = getFalseNeighbors(currentX, currentY, boolGrid, gridSize);

    //If no false neighbors, base case. Add the last point and close off the polyline. 
    //Start a new polyline as well -SJH
    if (falseNeighbors.length == 0){
        return ` ${currentX},${currentY}" stroke="${color}"
            stroke-width="${strokeWidth}" fill="none"/> <polyline points = "`;
    }
    //If false (unvisited) neighbors, pick randomly between them and recurse in that 
    //direction until there are no more false neighbors -SJH
    else {
        let returnString = "";
        while (getFalseNeighbors(currentX, currentY, boolGrid, gridSize).length > 0){
            //Pick a random neighbor -SJH
            let chosenPath = falseNeighbors[Math.floor(randomNumber(0, falseNeighbors.length))];
            //Add the current point to the returnString and recurse -SJH
            returnString += ` ${currentX},${currentY}` 
            + createMazeTile(chosenPath.xCoord, chosenPath.yCoord,
                boolGrid, gridSize, color, strokeWidth);
        }  
        return returnString;
    }
}

//Gets a list of all false neighbors (IE: univisted neighbors) to the specified grid space -SJH
const getFalseNeighbors = (x, y, boolGrid, gridSize) => {
    let falseNeighborArray = [];

    console.log(x + ", " + y);
    //Only check neighbor if they are inside the range of the grid -SJH
    if (x > 0){
        if (!boolGrid[x - 1, y]){
            falseNeighborArray.push({
                xCoord: x-1,
                yCoord: y
            });
            
        }
        console.log(boolGrid[x - 1, y]);
    }
    //Only check neighbor if they are inside the range of the grid -SJH
    if (x < gridSize - 1){
        if (!boolGrid[x + 1, y]){
            falseNeighborArray.push({
                xCoord: x+1,
                yCoord: y
            });
            
        }
        console.log(boolGrid[x + 1, y]);
    }
    //Only check neighbor if they are inside the range of the grid -SJH
    if (y > 0){
        if (!boolGrid[x, y - 1]){
            falseNeighborArray.push({
                xCoord: x,
                yCoord: y-1
            });
            
        }
        console.log(boolGrid[x, y - 1]);
    }
    //Only check neighbor if they are inside the range of the grid -SJH
    if (y < gridSize - 1){
        
        if (!boolGrid[x, y + 1]){
            falseNeighborArray.push({
                xCoord: x,
                yCoord: y+1
            });  
        }
        console.log(boolGrid[x, y + 1]);
    }
    console.log(falseNeighborArray);
    return falseNeighborArray;
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
    let newPolyLine = `<polyline points = "`;

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