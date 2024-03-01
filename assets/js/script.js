/**
 * DOM Loaded
 * 
 * Declear event listeners.
 * Run setCanvasSize() what runs draw().
 */
document.addEventListener("DOMContentLoaded",function(){
	// setCanvasSize
	setCanvasSize();
	// Run setCanvasSize() if the screen is resized.
	window.addEventListener("resize", setCanvasSize);
	// Different actions trigger the draw function.
	document.getElementById("user-text").addEventListener("input",draw);
	document.getElementById("color-comb").addEventListener("change",draw);
	document.getElementById("cube-color").addEventListener("change",draw);
	// Download button starts download an image from the canvas.
	document.getElementById("download").addEventListener("click",download);
	// With a color picker the user changes the backgrond of the canvas.
	document.getElementById("cube-background").addEventListener("change",changeBackground);
})

/**
 * Set size of the canvas, run draw()
 * */	
function setCanvasSize(){
	let canvas = document.getElementsByTagName("canvas")[0];
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	draw();
}

/**
 * Draw the cube text
 * */
function draw(){

	let canvas = document.getElementsByTagName("canvas")[0];
	const ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	let maxWidth=0;
	if (canvas.width<=500){
		maxWidth=33;
	} else if (canvas.width<=600){
		maxWidth=38;
	} else if (canvas.width<=768){
		maxWidth=40;
	} else if (canvas.width<=992){
		maxWidth=42;
	} else if (canvas.width<=1200){
		maxWidth=45;
	} else if (canvas.width<=1500){
		maxWidth=50;
	} else {
		maxWidth=55;
	}

	let lines =[];
	if (document.getElementById("user-text").value === ""){
		lines = ["cube text"];
	}else{
		lines = splitText(maxWidth);
	}

	let cubeNumber = 0;
	let letterNumber = 0;

	for (lineIndex in lines){
		let letters = lines[lineIndex];
		let horisontalLetterPosition = 0;


			// Get the lenght of the line
		let lengthOfLines=0;
		for (letterIndex in letters){
			let letterPlan = letterPlans(letters[letterIndex]);
			lengthOfLines += letterPlan.slice(-1)[0][1]+2;
		}
		cubeColors = getCubeColor();

		lengthOfLines -= 2;		let colorComb = document.getElementById("color-comb").value;
		let cubeColor = cubeColors[0];

		for (letterIndex in letters){
			if (colorComb=="rainbow-letter") 
				{cubeColor=cubeColors[letterNumber%12];}
			if (colorComb=="random-letter") 
				{cubeColor=cubeColors[Math.floor(Math.random()*12)];}

			if (letters[letterIndex]!==" "){
				let letterPlan = letterPlans(letters[letterIndex]);
				let horisontalShift;
					for(cubeIndex in letterPlan){
						let cube = letterPlan[cubeIndex];

						if (colorComb=="rainbow-cube") 
							{cubeColor=cubeColors[cubeNumber%12];}
						if (colorComb=="random-cube") 
							{cubeColor=cubeColors[Math.floor(Math.random()*12)];}

						drawCube(cube[0] + lineIndex*6,
						 	cube[1] + horisontalLetterPosition,
						 	lines.length,
						 	lengthOfLines,
						 	cubeColor,
						 	maxWidth);
						horisontalShift = cube[1];
						cubeNumber++;
					}
				horisontalLetterPosition += horisontalShift + 2;
			} else {
				horisontalLetterPosition++;
			}
		letterNumber++;
		}

	}
}

/**
 * Split the text in lines.
 * */
function splitText(maxWidth){

	// Read the text from the input text.
	let text = document.getElementById("user-text").value;
	// Make it lower case.
	text = text.toLowerCase();
	// Split the words.
	let words = text.split(" ");

	words = splitLongWords(words, maxWidth);
	// Collect the word lenghts.
	let wordLengths = wordLenghts(words);

	// Go till...
	let stay = true;
	while(stay){
		stay = false;
		// through the words...
		for (wordIndex in words){
			if(wordIndex==0){
				continue;
			}
			let lastWordIndex = wordIndex-1;
			 	// you can find short neighbor words...
			if(wordLengths[lastWordIndex] + wordLengths[wordIndex] < maxWidth){
				stay = true;
				// merge them...
				words[lastWordIndex] = words[lastWordIndex] +" "+ words[wordIndex];
				words.splice(wordIndex,1);
				// and their length.
				wordLengths[lastWordIndex] = wordLengths[lastWordIndex] + wordLengths[wordIndex];
				wordLengths.splice(wordIndex,1);
				break;
			}
		}
	}
	return words;
}

/**
 * Return the words lenght
 */
function wordLenghts(words){
	let wordLengths=[];
	for (wordIndex in words){
		let letters = words[wordIndex];
		wordLengths.push(0);
		for (letterIndex in letters){
			let letter = letters[letterIndex];
			letterLength = letterPlans(letter).slice(-1)[0][1]+2;
			wordLengths[wordIndex]+=letterLength;
		}
	}
	return wordLengths;
}

/**
 * Split the words if they are too long to fit in to the canvas.
 */
function splitLongWords(words, maxWidth){
	let stay = true;
	// Collect the word lenghts.
	let wordLengths = [];

	while (stay){
		stay = false;
		wordLengths = wordLenghts(words);
		for (wordIndex in wordLengths){
			if (wordLengths[wordIndex] > maxWidth){
				let wordsBefore = [];
				let wordsAfter = [];
				if (wordIndex != 0){
					wordsBefore = words.slice(0,wordIndex);
				}
				if (wordIndex+1 != wordLengths.length){
					wordsAfter = words.slice(wordIndex+1);
				}
				words = wordsBefore.concat(
					words[0].slice(0,maxWidth/6),
					words[0].slice(maxWidth/6),
					wordsAfter,);

				stay = true;
			}
		}
	}
	return words;
}

/**
 * Draws a cube.
 * */
function drawCube(yCubeStart, xCubeStart, numOfLines, lengthOfLines, cubeColor, maxWidth){

	let can = document.getElementsByTagName("canvas")[0];
	let ctx = can.getContext("2d");

	// Width of the cube.
	xx=can.width/(maxWidth+3);
	// Starting position of this cube on the x axis.
	x=xCubeStart*xx+(maxWidth+3-lengthOfLines)/2*xx;
	// Height of the cube.
	yy=xx*2;
	// Starting position of this cube on the y axis.
	y=yCubeStart*yy+can.height/2/numOfLines-2*yy;

	// Draws the front.
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(x,y);
	ctx.lineTo(x,y+yy);
	ctx.lineTo(x+xx,y+yy);
	ctx.lineTo(x+xx,y);
	ctx.closePath();
	ctx.stroke();
	ctx.fillStyle = cubeColor[0];
	ctx.fill();

	// Draws the top.
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(x,y);
	ctx.lineTo(x+xx,y);
	ctx.lineTo(x+1.5*xx,y-0.5*yy);
	ctx.lineTo(x+0.5*xx,y-0.5*yy);
	ctx.closePath();
	ctx.stroke();
	ctx.fillStyle = cubeColor[1];
	ctx.fill();

	// Draws the side.
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(x+xx,y);
	ctx.lineTo(x+xx,y+yy);
	ctx.lineTo(x+1.5*xx,y+0.5*yy);
	ctx.lineTo(x+1.5*xx,y-0.5*yy);
	ctx.closePath();
	ctx.stroke();
	ctx.fillStyle = cubeColor[2];
	ctx.fill();
}

/**
 * Returns the given letter's building cube's coordinates.
 */
function letterPlans(letter){
	let letters={
		"a":[[4,0],[3,0],[2,0],[1,0],[0,0],[2,1],[0,1],[4,2],[3,2],[2,2],[1,2],[0,2]],
		"b":[[4,0],[3,0],[2,0],[1,0],[0,0],[2,1],[4,1],[4,2],[3,2],[2,2]],
		"c":[[4,0],[3,0],[2,0],[1,0],[0,0],[4,1],[0,1],[4,2],[0,2]],
		"d":[[4,0],[3,0],[2,0],[4,1],[2,1],[4,2],[3,2],[2,2],[2,2],[1,2],[0,2]],
		"e":[[4,0],[3,0],[2,0],[1,0],[0,0],[4,1],[2,1],[0,1],[4,2],[2,2],[1,2],[0,2]],
		"f":[[4,0],[3,0],[2,0],[1,0],[0,0],[2,1],[0,1],[2,2],[0,2]],
		"g":[[4,0],[3,0],[2,0],[1,0],[0,0],[4,1],[0,1],[4,2],[2,2],[0,2],[4,3],[3,3],[2,3],[0,3]],
		"h":[[4,0],[3,0],[2,0],[1,0],[0,0],[2,1],[4,2],[3,2],[2,2],[1,2],[0,2]],
		"i":[[4,0],[3,0],[2,0],[1,0],[0,0]],
		"j":[[4,0],[3,0],[4,1],[0,2],[4,2],[3,2],[2,2],[1,2],[0,2]],
		"k":[[4,0],[3,0],[2,0],[1,0],[0,0],[2,1],[4,2],[3,2],[1,2],[0,2]],
		"l":[[4,0],[3,0],[2,0],[1,0],[0,0],[4,1],[4,2]],
		"m":[[4,0],[3,0],[2,0],[1,0],[0,0],[1,1],[2,2],[1,3],[4,4],[3,4],[2,4],[1,4],[0,4]],
		"n":[[4,0],[3,0],[2,0],[1,0],[0,0],[2,1],[1,1],[3,2],[2,2],[4,3],[3,3],[2,3],[1,3],[0,3]],
		"o":[[4,0],[3,0],[2,0],[1,0],[0,0],[4,1],[0,1],[4,2],[0,2],[4,3],[3,3],[2,3],[1,3],[0,3]],
		"p":[[4,0],[3,0],[2,0],[1,0],[0,0],[2,1],[0,1],[1,2],[2,2],[1,2],[0,2]],
		"q":[[4,0],[3,0],[2,0],[1,0],[0,0],[4,1],[0,1],[4,2],[3,2],[0,2],[4,3],[3,3],[2,3],[1,3],[0,3]],
		"r":[[4,0],[3,0],[2,0],[1,0],[0,0],[3,1],[2,1],[0,1],[4,2],[2,2],[1,2],[0,2]],
		"s":[[4,0],[2,0],[1,0],[0,0],[4,1],[2,1],[0,1],[4,2],[3,2],[2,2],[0,2]],
		"t":[[0,0],[4,1],[3,1],[2,1],[1,1],[0,1],[0,2]],
		"u":[[4,0],[3,0],[2,0],[1,0],[0,0],[4,1],[4,2],[3,2],[2,2],[1,2],[0,2]],
		"v":[[3,0],[2,0],[1,0],[0,0],[4,1],[3,2],[2,2],[1,2],[0,2]],
		"w":[[3,0],[2,0],[1,0],[0,0],[4,1],[3,2],[2,2],[1,2],[0,2],[4,3],[3,4],[2,4],[1,4],[0,4]],
		"x":[[4,0],[3,0],[1,0],[0,0],[2,1],[4,2],[3,2],[1,2],[0,2]],
		"y":[[2,0],[1,0],[0,0],[4,1],[3,1],[2,2],[1,2],[0,2]],
		"z":[[4,0],[3,0],[0,0],[4,1],[2,1],[0,1],[4,2],[1,2],[0,2]],
		" ":[[0,-1]],
	};
	if (letters[letter] !== undefined){
		return letters[letter];
	}
	else{
		return [[]]
	}
}

/***
 * Reads the color given by the user,
 * and return it with analogus colors
 * and shades.
 */
function getCubeColor(){
	// Read user color.
	let pickedColor = document.getElementById("cube-color").value;
	// Turns the color to RGB.
	let rgbArray = hexToRGB(pickedColor);
	// Gives the analogous colors
	let rgbsArray = analogous(rgbArray);
	// Gives the shades
    let cubeColor = [];
    for (let i=0;i<12;i++){
    	cubeColor[i]=shades(rgbsArray[i]);
    }	
	return cubeColor;
}

/**
 *  Makes an array with decimal numbers from a hexadecimal color code
 */
function hexToRGB(hex){
	// Slices the hex code in three.
	let color = [hex.slice(1,3),hex.slice(3,5),hex.slice(5,7)];
	// Change all the three hexadecimal number to decimal.
	for (let i=0; i<3; i++){
		let num1=0;
		switch (color[i][0]){
			case "f": num1 = 15; break;
			case "e": num1 = 14; break;
			case "d": num1 = 13; break;
			case "c": num1 = 12; break;
			case "b": num1 = 11; break;
			case "a": num1 = 10; break;
			default : num1 = parseInt(color[i][0]); break;
		}
		let num2=0;
		switch (color[i][1]){
			case "f": num2 = 15; break;
			case "e": num2 = 14; break;
			case "d": num2 = 13; break;
			case "c": num2 = 12; break;
			case "b": num2 = 11; break;
			case "a": num2 = 10; break;
			default : num2 = parseInt(color[i][1]); break;
		}
		color[i]=num1*16+num2;
	}
	return color;
}

function shades(RGBArray){
	let RGB = [];
	RGB[0] = "rgb("+RGBArray[0]+","+RGBArray[1]+","+RGBArray[2]+")";
	RGB[1] = "rgb("+Math.floor(RGBArray[0]*0.75)+","+Math.floor(RGBArray[1]*0.75)+","+Math.floor(RGBArray[2]*0.75)+")";
	RGB[2] = "rgb("+Math.floor(RGBArray[0]*0.5)+","+Math.floor(RGBArray[1]*0.5)+","+Math.floor(RGBArray[2]*0.5)+")";
	return RGB;
}

/**
 * Gives the analogous coloros of the chosen color.
 * 
 * Takes the rgb components of the chosen color in an array
 * and returns of the rgb components of the color and
 * its analogus color in a matrix.
 */
function analogous(rgbArray){
	// Declare the matrix and assign its first row.
	let rgbsArrays=[rgbArray];
	// Make a deep copy from the chosen color.
	let rgbArrayCopy = [...rgbArray];

	// Take the smaller component.
	let min = Math.min(rgbArrayCopy[0],rgbArrayCopy[1],rgbArrayCopy[2]);
	// Take the index of the smaller component.
	let minIndex = rgbArrayCopy.indexOf(min);
	// Raise the smaller component for the next step.
	rgbArrayCopy[minIndex] = 300;

	// Take the middle component.
	let mid = Math.min(rgbArrayCopy[0],rgbArrayCopy[1],rgbArrayCopy[2]);
	// Take the index of the middle component.
	let midIndex = rgbArrayCopy.indexOf(mid);
	// Raise the middle component for the next step.
	rgbArrayCopy[midIndex] = 300;

	// Take the biggest component.
	let max = Math.min(rgbArrayCopy[0],rgbArrayCopy[1],rgbArrayCopy[2]);
	// Take the index of the biggest component.
	let maxIndex = rgbArrayCopy.indexOf(max);

	// Take the distance between to analogous color.
	let step = (max-min)/2;

	// Set back the copy
	rgbArrayCopy = [...rgbArray];

	// Fill the last 11 row
	for(let i=1; i<12; i++){
		/* 
			If the biggest number is before the middle
			number then it adds a step to the middle number
			otherwise is substrackts one.
		*/
		if(maxIndex==0 && midIndex==1 || maxIndex==1 && midIndex==2 || maxIndex==2 && midIndex==0){
			/*
				If the bigger value further from the middle value than one step
				then raises the middle value with one step,
				otherwise raises till the bigger value,
				and substrackts the leftover from the bigger value. 
			*/
			if(max-step>mid){
				rgbArrayCopy[midIndex]=mid+step;

				mid=mid+step;
			} else {
				rgbArrayCopy[maxIndex]=2*max-mid-step;
				rgbArrayCopy[midIndex]=max;

				mid = 2*max-mid-step;
				// Swaps the mid and max index.
				let variable = midIndex;
				midIndex = maxIndex;
				maxIndex = variable;
			}
		} else {
			/*
				If the smaller value further from the middle value than one step
				then lowwers the middle value with one step,
				otherwise lowers till the smaller value,
				and adds the leftover to the smaller value. 
			*/
			if(min+step<mid){
				rgbArrayCopy[midIndex]=mid-step;

				mid=mid-step;
			} else {
				rgbArrayCopy[midIndex]=min;
				rgbArrayCopy[minIndex]=2*min+step-mid;
			
				mid = 2*min+step-mid;
			// Swaps the mid and min index.	
				let variable = midIndex;
				midIndex = minIndex;
				minIndex = variable;
			}
		}
		// Adds the new color to the matrix.
	rgbsArrays[i] = [...rgbArrayCopy];	
	}
	return rgbsArrays;
}

/**
 * Download an image from canvas
 */
function download(){

    const can = document.getElementsByTagName("canvas")[0];
	const copyButton = document.getElementById("download");

  	const dataURL = can.toDataURL("image/png");
   
    const anchor = document.createElement("a");
    anchor.href = dataURL;
    anchor.download = "cube-text.png";
    anchor.click();
    anchor.remove();
}
/**
 * Change background of canvas
 */
function changeBackground(){
	let can = document.getElementsByTagName("canvas")[0];
	can.style.backgroundColor=document.getElementById("cube-background").value;
	console.log(can.style.backgroundColor);
}