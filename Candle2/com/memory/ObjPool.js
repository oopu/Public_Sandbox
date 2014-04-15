//Object pool thing, for memory management
//This pool is STRICT, in that it will not allocate more than the global POOL_SIZE value. If there are no more objects available, null will be returned.

var ObjPool = (function (){

	var pool = [];
		
	var public = {};

	public.init = function(poolSize){
		
		/* NOPE. All will be drawn on each DRAW_CYCLE and are NOT owned by each Particle
		var particleShape = canvas.getContext('2d'); //shape that will be assigned to each particle. Calculated once here instead of repeatedly in the loop.
		particleShape.fillStyle = "rgba(255, 100, 100, 1)";
		particleShape.fillRect(0, 0, PARTICLE_SIZE, PARTICLE_SIZE);
		*/
		for(var i = 0; i < poolSize; i++){
			//init Particles
			pool[i] = new Particle();
		}
		console.log("ObjPool initialized with " + pool.length + " particles for use.");
	};
	
	public.getObj = function(){
		
		if(pool.length > 1){
		
			//console.log("sending out a particle for use. Pool size = " + (pool.length - 1));
			return pool.pop();
		}
		else{
		
			//console.log("No more particles available.");
			return null;
		}
		
	};
	
	public.returnObj = function(deadObj){
		
		if(pool.length < POOL_SIZE){
			
			//Cleanse the returned Particle by resetting it.
			
			pool.push(deadObj);
			//console.log("dead particle returned. Pool size = " + pool.length);
		}
		else{
			console.log("How did you give the pool an extra object? Object you're trying to push is a " + deadObj);
		}
	};
	
	return public;
}());