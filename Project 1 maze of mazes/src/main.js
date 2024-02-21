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
    const strokeWidth = .5
    const tileGridSize = 5;
    const numTiles = 10;
    const tileScale = svgSize/tileGridSize/numTiles; 
    //Preparing outer maze -SJH
    let outerBoolGrid = make2DBoolArray(numTiles, numTiles);
    resetBoolGrid(outerBoolGrid, tileGridSize);
    let outerGridConnections = makeConnectionsArray(numTiles, numTiles);
    //Preparing tiles -SJH
    let tileBoolGrid = make2DBoolArray(tileGridSize, tileGridSize);
    resetBoolGrid(tileBoolGrid, tileGridSize);

    //Generating outer maze -SJH
    createOuterMaze(0,0, outerBoolGrid, outerGridConnections, numTiles);

    //Creating maze tiles and their connections-SJH
    for (let outerX = 0; outerX < numTiles; outerX++) {
        for (let outerY = 0; outerY < numTiles; outerY++){
            resetBoolGrid(tileBoolGrid, tileGridSize);
            //Generate this grid tile -SJH
            let randomX = Math.floor(randomNumber(0, tileGridSize)); 
            let randomY = Math.floor(randomNumber(0, tileGridSize));

            //Each tile gets its own group with transformations applied -SJH
            svgElement.innerHTML += addGroup(
                `<polyline points = "` + createMazeTile(randomX,randomY,
                    tileBoolGrid, tileGridSize, "black", strokeWidth),
                    0, 0, 0,                                                    //Rotation
                    outerX * tileScale * tileGridSize + strokeWidth,            //Displacement X
                    outerY * tileScale * tileGridSize + strokeWidth,            //Displacement Y
                    tileScale, tileScale);                                      //Scale
            
            //Generate the connections from this grid by checking outerGridConnections -SJH
            let exits = outerGridConnections[outerX][outerY].exits;
            for (let i = 0; i < exits.length; i++){
                let innerX1;
                let innerY1;
                let innerX2;
                let innerY2;
                let lineString;
                //Determine how to connect to the specific connection -SJH
                //Right -SJH
                if (outerX < exits.xCoord) {
                    innerX1 = tileGridSize - 1;
                    innerX2 = tileGridSize;
                    innerY1 = Math.floor(randomNumber(0, tileGridSize));
                    innerY2 = innerY1;
                }
                //Left -SJH
                else if (outerX > exits.xCoord) {
                    innerX1 = 0;
                    innerX2 = -1;
                    innerY1 = Math.floor(randomNumber(0, tileGridSize));
                    innerY2 = innerY1;
                }
                //Up -SJH
                else if (outerY < exits.yCoord) {
                    innerX1 = Math.floor(randomNumber(0, tileGridSize));
                    innerX2 = innerX1;
                    innerY1 = tileGridSize - 1;
                    innerY2 = tileGridSize;
                }
                //Down -SJH
                else {
                    innerX1 = Math.floor(randomNumber(0, tileGridSize));
                    innerX2 = innerX1;
                    innerY1 = 0;
                    innerY2 = -1;
                }

                //Create the line string and add it to the svg -SJH
                lineString = addLine(innerX1, innerY1, innerX2, innerY2, "blue", strokeWidth);
                svgElement.innerHTML += addGroup(lineString,
                    0, 0, 0,                                                    //Rotation
                    outerX * tileScale * tileGridSize + strokeWidth,            //Displacement X
                    outerY * tileScale * tileGridSize + strokeWidth,            //Displacement Y
                    tileScale, tileScale);                                      //Scale
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
    //addRotatedRect(0,0, width,height, 0, "black", 1);
}

//Resets a grid of booleans to false -SJH
const resetBoolGrid = (boolGrid, gridSize) => {
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            boolGrid[x][y] = false;
        }
    }
    
}

//Creates a 2D boolean array with a specified size -SJH
const make2DBoolArray = (x, y) => {
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

//Creates a 2D array of objects to hold the connections between grid tiles -SJH
const makeConnectionsArray = (x, y) => {
    let array = [];
    for (let i = 0; i < x; i++) {
        let array2 = [];
        for (let k = 0; k < y; k++){
            //Empty object that will contain one of four values: "up", "down", 
            array2.push({
                exits: []
            });
        }
        array.push(array2);
    }
    return array;
}

//Called to create the outer maze that the tiles will be placed in. Recursive function -SJH
const createOuterMaze = (currentX, currentY, boolGrid, gridConnections, gridSize) => {
    //Mark this grid tile as true (visited) -SJH
    boolGrid[currentX][currentY] = true;
    console.log(currentX + ", " + currentY);
    //Check how many false neighbors there are -SJH
    let falseNeighbors = getFalseNeighbors(currentX, currentY, boolGrid, gridSize);

    //If no false neighbors, base case. No exit for this tile. -SJH 
    if (falseNeighbors.length == 0){
        return;
    }
    //If false (unvisited) neighbors, pick randomly between them and recurse in that 
    //direction until there are no more false neighbors -SJH
    else {
        while (falseNeighbors.length > 0){
            //Pick a random neighbor -SJH
            let chosenPath = falseNeighbors[Math.floor(randomNumber(0, falseNeighbors.length))];
            //Add the exit to this tile and recurse to it -SJH
            gridConnections[currentX][currentY].exits.push(chosenPath);
            createOuterMaze(chosenPath.xCoord, chosenPath.yCoord, boolGrid, gridConnections, gridSize);
            //Refresh false neighbors for the next iteration after recursion has finished. -SJH
            falseNeighbors = getFalseNeighbors(currentX, currentY, boolGrid, gridSize)
        }  
        return;
    }
}

//Recursive function. Creates a maze. -SJH
const createMazeTile = (currentX, currentY, boolGrid, gridSize, 
    color, strokeWidth) => {
    //Mark this grid tile as true (visited) -SJH
    boolGrid[currentX][currentY] = true;

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
        while (falseNeighbors.length > 0){
            //Pick a random neighbor -SJH
            let chosenPath = falseNeighbors[Math.floor(randomNumber(0, falseNeighbors.length))];
            //Add the current point to the returnString and recurse -SJH
            returnString += ` ${currentX},${currentY}` 
            + createMazeTile(chosenPath.xCoord, chosenPath.yCoord,
                boolGrid, gridSize, color, strokeWidth);
            //Refresh false neighbors for the next iteration after recursion has finished. -SJH
            falseNeighbors = getFalseNeighbors(currentX, currentY, boolGrid, gridSize)
        }  
        return returnString;
    }
}

//Gets a list of all false neighbors (IE: univisted neighbors) to the specified grid space -SJH
const getFalseNeighbors = (x, y, boolGrid, gridSize) => {
    let falseNeighborArray = [];
    
    //Only check neighbor if they are inside the range of the grid -SJH
    if (x > 0){
        if (!boolGrid[x - 1][y]){
            falseNeighborArray.push({
                xCoord: x-1,
                yCoord: y
            });
            
        }
    }
    //Only check neighbor if they are inside the range of the grid -SJH
    if (x < gridSize - 1){
        if (!boolGrid[x + 1][y]){
            falseNeighborArray.push({
                xCoord: x+1,
                yCoord: y
            });
            
        }
    }
    //Only check neighbor if they are inside the range of the grid -SJH
    if (y > 0){
        if (!boolGrid[x][y - 1]){
            falseNeighborArray.push({
                xCoord: x,
                yCoord: y-1
            });
            
        }
    }
    //Only check neighbor if they are inside the range of the grid -SJH
    if (y < gridSize - 1){
        
        if (!boolGrid[x][y + 1]){
            falseNeighborArray.push({
                xCoord: x,
                yCoord: y+1
            });  
        }
    }

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