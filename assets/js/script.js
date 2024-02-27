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
						 	lengthOfLines);
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
	console.log(words);
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
					wordsAfter);

				stay = true; 
				console.log(wordsAfter);
			}
		}
	}
	return words;
}

function drawCube(x, y, numOfLines, lengthOfLines){
	xx=10;
	yy=8;
	x=x*xx+xx;
	y=y*yy+yy;
	let can = document.getElementsByTagName("canvas")[0];
	let ctx = can.getContext("2d");

	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(y,x);
	ctx.lineTo(y+yy-1,x);
	ctx.lineTo(y+yy-1,x+xx-1);
	ctx.lineTo(y,x+xx-1);
	ctx.closePath();
	ctx.stroke();
	ctx.fillStyle = "#3366FF";
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
		"a":[[0,0],[1,0],[2,0],[3,0],[4,0],[0,1],[2,1],[0,2],[1,2],[2,2],[3,2],[4,2]],
		"b":[[0,0],[1,0],[2,0],[3,0],[4,0],[2,1],[4,1],[2,2],[3,2],[4,2]],
		"c":[[0,0],[1,0],[2,0],[3,0],[4,0],[0,1],[4,1],[0,2],[4,2]],
		"d":[[2,0],[3,0],[4,0],[2,1],[4,1],[0,2],[1,2],[2,2],[3,2],[4,2]],
		"e":[[0,0],[1,0],[2,0],[3,0],[4,0],[0,1],[2,1],[4,1],[0,2],[1,2],[2,2],[4,2]],
		"f":[[0,0],[1,0],[2,0],[3,0],[4,0],[0,1],[2,1],[0,2],[2,2]],
		"g":[[0,0],[1,0],[2,0],[3,0],[4,0],[0,1],[4,1],[0,2],[2,2],[4,2],[0,3],[2,3],[3,3],[4,3]],
		"h":[[0,0],[1,0],[2,0],[3,0],[4,0],[2,1],[0,2],[1,2],[2,2],[3,2],[4,2]],
		"i":[[0,0],[1,0],[2,0],[3,0],[4,0]],
		"j":[[3,0],[4,0],[4,1],[0,2],[1,2],[2,2],[3,2],[4,2]],
		"k":[[0,0],[1,0],[2,0],[3,0],[4,0],[2,1],[0,2],[1,2],[3,2],[4,2]],
		"l":[[0,0],[1,0],[2,0],[3,0],[4,0],[4,1],[4,2]],
		"m":[[0,0],[1,0],[2,0],[3,0],[4,0],[1,1],[2,2],[1,3],[0,4],[1,4],[2,4],[3,4],[4,4]],
		"n":[[0,0],[1,0],[2,0],[3,0],[4,0],[1,1],[2,1],[2,2],[3,2],[0,3],[1,3],[2,3],[3,3],[4,3]],
		"o":[[0,0],[1,0],[2,0],[3,0],[4,0],[0,1],[4,1],[0,2],[4,2],[0,3],[1,3],[2,3],[3,3],[4,3]],
		"p":[[0,0],[1,0],[2,0],[3,0],[4,0],[0,1],[2,1],[0,2],[1,2],[2,2]],
		"q":[[0,0],[1,0],[2,0],[3,0],[4,0],[0,1],[4,1],[0,2],[3,2],[4,2],[0,3],[1,3],[2,3],[3,3],[4,3]],
		"r":[[0,0],[1,0],[2,0],[3,0],[4,0],[0,1],[2,1],[3,1],[0,2],[1,2],[2,2],[4,2]],
		"s":[[0,0],[1,0],[2,0],[4,0],[0,1],[2,1],[4,1],[0,2],[2,2],[3,2],[4,2]],
		"t":[[0,0],[0,1],[1,1],[2,1],[3,1],[4,1],[0,2]],
		"u":[[0,0],[1,0],[2,0],[3,0],[4,0],[4,1],[0,2],[1,2],[2,2],[3,2],[4,2]],
		"v":[[0,0],[1,0],[2,0],[3,0],[4,1],[0,2],[1,2],[2,2],[3,2]],
		"w":[[0,0],[1,0],[2,0],[3,0],[4,1],[0,2],[1,2],[2,2],[3,2],[4,3],[0,4],[1,4],[2,4],[3,4]],
		"x":[[0,0],[1,0],[3,0],[4,0],[2,1],[0,2],[1,2],[3,2],[4,2]],
		"y":[[0,0],[1,0],[2,0],[3,1],[4,1],[0,2],[1,2],[2,2]],
		"z":[[0,0],[3,0],[4,0],[0,1],[2,1],[4,1],[0,2],[1,2],[4,2]],
		" ":[[0,-1]],
	};
	if (letters[letter] !== undefined){
		return letters[letter];
	}
	else{
		return [[]]
	}
}