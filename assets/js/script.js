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
	let lines =[];
	if (document.getElementById("user-text").value === ""){
		lines = ["cube text"];
	}else{
		// lower case
		// calculate lines
		// split
		lines = ["cube","text","test"];
	}
	for (lineIndex in lines){
		let letters = lines[lineIndex];
		let horisontalLetterPosition = 0;
			for (letterIndex in letters){
				let letterPlan = letterPlans(letters[letterIndex]);
				let horisontalShift;
				for(cubeIndex in letterPlan){
					cube = letterPlan[cubeIndex];
					 drawCube(cube[0] + lineIndex*6, cube[1] + horisontalLetterPosition);
					 horisontalShift = cube[1];
				}
				horisontalLetterPosition += horisontalShift + 2;
			}
	}
}
function drawCube(x, y){
	console.log("x: "+ x +" y: "+y);
	xx=15;
	yy=15;
	x*=xx;
	y*=yy;
	let can = document.getElementsByTagName("canvas")[0];
	let ctx = can.getContext("2d");

	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(y,x);
	ctx.lineTo(y+yy,x);
	ctx.lineTo(y+yy,x+xx);
	ctx.lineTo(y,x+xx);
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
	};
	if (letters[letter] !== undefined){
		return letters[letter];
	}
	else{
		return [[]]
	}
}