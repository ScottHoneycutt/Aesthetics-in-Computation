Scott Honeycutt
To run my program, you will need to open the "SVG stuff" folder (where index.html lives) in Visual Studio Code and use Live Server to run the program. You will need to install the Live Server extension if you do not already have it.

All of the code my program uses can be found in "SVG stuff/src/main.js". To modify which code my program runs (and thus which SVG is created), simply comment and uncomment one of three chunks of code in the init() method. Each chunk is commented accordingly.

The SVG files this program creates can be found inside the "SVG stuff/media" folder.

The modified version of the art piece I made used recursion to add a fade effect without using the fill property. The color of each square fades to white when moving from the border of the square towards the center of the square. The difference is subtle unless put side-by-side with the original piece, and I actually like it better that way.