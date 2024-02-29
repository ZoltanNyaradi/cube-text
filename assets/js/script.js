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

	let lines =[];
	if (document.getElementById("user-text").value === ""){
		lines = ["cube text"];
	}else{
		// lower case
		// calculate lines
		lines = splitText();
	}
	for (lineIndex in lines){
		let letters = lines[lineIndex];
		let horisontalLetterPosition = 0;


			// Get the lenght of the line
		let lengthOfLines=0;
		for (letterIndex in letters){
			let letterPlan = letterPlans(letters[letterIndex]);
			lengthOfLines += letterPlan.slice(-1)[0][1]+2;
		}
		cubeColor = getCubeColor();

		lengthOfLines -= 2;
		for (letterIndex in letters){
			if (letters[letterIndex]!==" "){
				let letterPlan = letterPlans(letters[letterIndex]);
				let horisontalShift;
					for(cubeIndex in letterPlan){
						let cube = letterPlan[cubeIndex];
						drawCube(cube[0] + lineIndex*6,
						 	cube[1] + horisontalLetterPosition,
						 	lines.length,
						 	lengthOfLines,
						 	cubeColor[cubeIndex%12]);
						horisontalShift = cube[1];
					}
				horisontalLetterPosition += horisontalShift + 2;
			} else {
				horisontalLetterPosition++;
			}
		}

	}
}

/**
 * Split the text in lines.
 * */
function splitText(){

	// Read the text from the input text.
	let text = document.getElementById("user-text").value;
	// Make it lower case.
	text = text.toLowerCase();
	// Split the words.
	let words = text.split(" ");
	// The maximum cube number in a row.
	let maxWidth = 33;

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

function drawCube(yCubeStart, xCubeStart, numOfLines, lengthOfLines, cubeColor){

	let can = document.getElementsByTagName("canvas")[0];
	let ctx = can.getContext("2d");

	xx=can.width/36;
	x=xCubeStart*xx+(36-lengthOfLines)/2*xx;
	yy=xx*2;
	y=yCubeStart*yy+can.height/2/numOfLines-2*yy;

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
 * Download an image from canvas
 */
function download(){
	console.log("File downloaded!");
}

/**
 * Change background of canvas
 */
function changeBackground(){
	console.log("Background changed!");
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

function getCubeColor(){

	let colorComb = document.getElementById("color-comb").value;
	let pickedColor = document.getElementById("cube-color").value;
	
	let rgbArray = hexToRGB(pickedColor);
	let rgbsArray = analogous(rgbArray);
	
    let cubeColor = [];
    for (let i=0;i<12;i++){
    	cubeColor[i]=shades(rgbsArray[i]);
    }


	if (colorComb == "single"){
		

		
	}
		
	return cubeColor;
}

function hexToRGB(hex){
	let color = [hex.slice(1,3),hex.slice(3,5),hex.slice(5,7)];
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

function analogous(rgbArray){
	let rgbsArrays=[rgbArray];

	let rgbArrayCopy = [...rgbArray];

	let min = Math.min(rgbArrayCopy[0],rgbArrayCopy[1],rgbArrayCopy[2]);
	let minIndex = rgbArrayCopy.indexOf(min);
	rgbArrayCopy[minIndex] = 300;

	let mid = Math.min(rgbArrayCopy[0],rgbArrayCopy[1],rgbArrayCopy[2]);
	let midIndex = rgbArrayCopy.indexOf(mid);
	rgbArrayCopy[midIndex] = 300;

	let max = Math.min(rgbArrayCopy[0],rgbArrayCopy[1],rgbArrayCopy[2]);
	let maxIndex = rgbArrayCopy.indexOf(max);

	let step = (max-min)/2;

	rgbArrayCopy = [...rgbArray];

	for(let i=1; i<12; i++){
		if(maxIndex==0 && midIndex==1 || maxIndex==1 && midIndex==2 || maxIndex==2 && midIndex==0){
			if(max-step>mid){
				rgbArrayCopy[maxIndex]=max;
				rgbArrayCopy[midIndex]=mid+step;
				rgbArrayCopy[minIndex]=min;

				mid=mid+step;
			} else {
				rgbArrayCopy[maxIndex]=2*max-mid-step;
				rgbArrayCopy[midIndex]=max;
				rgbArrayCopy[minIndex]=min;

				mid = 2*max-mid-step;

				let variable = midIndex;
				midIndex = maxIndex;
				maxIndex = variable;
			}
		} else {
			if(min+step<mid){
				rgbArrayCopy[maxIndex]=max;
				rgbArrayCopy[midIndex]=mid-step;
				rgbArrayCopy[minIndex]=min;

				mid=mid-step;
			} else {
				rgbArrayCopy[maxIndex]=max;
				rgbArrayCopy[midIndex]=min;
				rgbArrayCopy[minIndex]=2*min+step-mid;

				mid = 2*min+step-mid;
				let variable = midIndex;
				midIndex = minIndex;
				minIndex = variable;
			}
		}
	rgbsArrays[i] = [...rgbArrayCopy];	
	}
	 console.log(rgbsArrays);

	return rgbsArrays;
}