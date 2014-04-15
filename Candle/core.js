//A core JS class for holding loaded XML values and printing them to the page

var NUM_PARTICLES = 70;
var START_X = 452;
var START_Y = 450;
var SCATTER = 20;

function Core() {
	

	var particles; 
	
	//init is then called only once the DOM is loaded
}

/*This seems to do nothing besides log to the console when that's active*/
Core.prototype.reshiftParticles = function(){
	//console.log("Reshifting particles...");

	for(var i = 0; i < NUM_PARTICLES; i++){
		var randoX = Math.floor(Math.random()*SCATTER);
		var randoY = Math.floor(Math.random()*SCATTER);
		
		particles[i].shiftX(randoX);
		particles[i].shiftY(randoY);
	}
};

Core.prototype.init = function(){
	
	particles = [];
	
	console.log("Core constructed. Initializing...");
	
	var $emitter = $("#emitter");
	
	for(var i=0; i< NUM_PARTICLES; i++)
	{
		particles.push(Particle.create(i, START_X, START_Y));

		var randoX = Math.floor(Math.random()*SCATTER);
		var randoY = Math.floor(Math.random()*SCATTER);
		
		particles[i].shiftX(randoX);
		particles[i].shiftY(randoY);
		$emitter.append(particles[i].getObj);
	}
	
	//window.setInterval(this.reshiftParticles, 1200); Apparently does nothing
	
	console.log("Particles generated and emitting");
};



