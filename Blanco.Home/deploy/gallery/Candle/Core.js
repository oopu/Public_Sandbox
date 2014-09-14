var NUM_PARTICLES = 70;
var START_X = 452;
var START_Y = 450;
var SCATTER = 20;

var Core = (function (){

	var particles; 
	var pub = {};
	
	/**Constructor function. To be called only once the DOM has loaded.
	*/
	pub.init = function (){
		
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
		
		console.log("Particles generated and emitting");
	};

	return pub;
})();