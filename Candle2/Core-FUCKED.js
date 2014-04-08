//Core engine for the Feesh sandbox project.
//Copyright Christopher Blanco of FireEye, 2013

//global constants

var BG_FILL = "rgb(120, 120, 255)";

var canvas;
var activeParticles = []; //used by Emitter (to populate) and by Core (to draw and empty)
var animID; //used to store the animation requests that are queued and to cancel them later

var Core = (function () {
	
	/* BEGIN PSEUDOCODE -------------
	*/
	
	var drawHandle;
	var isLooping = false;
	
	var clear = function(){
		
		drawHandle.fillStyle = BG_FILL;
		drawHandle.fillRect(0, 0, canvas.width, canvas.height);
	};
	
	var drawParticles = function(){
	
		drawHandle.fillStyle = PARTICLE_FILL;
		
		for(var i = 0; i < activeParticles.length; i++){
			
			//Since particles track their own life
			if(activeParticles[i].active){
			
				console.log("Drawing a particle at [" + activeParticles[i].position.x + ", " + activeParticles[i].position.y);
				drawHandle.fillRect(activeParticles[i].position.x, activeParticles[i].position.y, PARTICLE_SIZE, PARTICLE_SIZE);
			}
		}
		console.log((i + 1) + " particles drawn on the canvas.");
	};
	
	var draw = function(){
		
		drawParticles();
	};
	
	var update = function(){
	
		//loop through active particles and have them check stuff
		//for(var i = 0; i < activeParticles.length; i++){ DUDE I JUST PROVED THIS IS ERRONEOUS THIS MORNING!
		for(var i = (activeParticles.length-1); i > 0; i--){
		
			//activeParticles[i].tickLife();
			
			if(activeParticles[i].active){
				
				activeParticles[i].move();
			}
			else{
								

			}
		}
	};
	
	var queue = function(){
		
		//because this seems to override the button click otherwise
		if(isLooping){
			
			animID = window.requestAnimationFrame(startLoop);
		}
		else{
			
			//clear();
		}
	}
	
	var startLoop = function(){
		
			clear();
			update();
			draw();		
			queue();		
	};
	
	/* Not needed since we're always looping
	var toggleLoop = function(){
		
		if(isLooping){
		
			window.cancelAnimationFrame(animID);
			isLooping = false;
			clear();
			console.log("Looping stopped");
		}
		else{
		
			isLooping = true;
			startLoop();
			console.log("Starting loop");
		}
	};
	*/
	
	var public = {};
	
	
	public.init = function(){
		console.log("Initializing...");
		
		//Some HMTL setup stuff
		canvas = document.querySelector('canvas');
		
		drawHandle = canvas.getContext('2d'); //shape that will be assigned to each particle. Calculated once here instead of repeatedly in the loop.
		
		//Setup object pool
		
		//ObjPool.init(POOL_SIZE);
		
		console.log("Init complete. Waiting for user input.");
	};
	
	return public;
}());