document.addEventListener("DOMContentLoaded",function(){
	canvas = document.getElementsByTagName("canvas")[0];
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	let canvasWidth = 0;

		
	measure();

	window.addEventListener("resize", measure);

	document.getElementById("user-text").addEventListener("input",draw);
	document.getElementById("color-comb").addEventListener("change",draw);
	document.getElementById("cube-color").addEventListener("change",draw);

	document.getElementById("download").addEventListener("click",download);
	
	document.getElementById("cube-background").addEventListener("change",changeBackground);
})	
function measure(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvasWidth = document.getElementsByTagName("canvas")[0].width;
	
	draw();
}

function draw(){
	
}

function download(){
	console.log("File downloaded!");
}
function changeBackground(){
	console.log("Background changed!");
}