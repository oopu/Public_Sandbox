//Emitter thing!

var Emitter = (function (){
	
	var getStartX = function(){
	
		return (EMITTER_WIDTH * Math.random()) + ((canvas.width / 2) - EMITTER_WIDTH);
	};
	
	var public = {};
	
	public.emit = function(){
		
		var	newPart;
		
		for(var i = 0; i < EMITTER_RATE; i++){
			
			newPart = ObjPool.getObj();
			
			if(newPart){
				
				newPart.activate(new Vector(getStartX(), (canvas.height-100)), new Vector(0, -EMITTER_VELOCITY), PARTICLE_LIFE);
				//activeParticles.push(newPart);				
				activeParticles.unshift(newPart);				
			}
		}
	}; 
	
	return public;
}());