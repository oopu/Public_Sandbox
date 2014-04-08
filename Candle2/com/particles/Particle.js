// Particle object definition. Borrows from the ParticleTut project.

var Particle = function () {
	
	/* Going to move this to Vector stuff
	var posX = 0;
	var posY = 0;
	var angle = 0;
	var velocity = 0;
	*/
	var position; //a Vector
	var velocity; //another Vector
			
	var life = PARTICLE_LIFE; //also set in activate() just in case it is to change at runtime
	var active = false;	
};

//This looks around for nearby particles and adjusts this.velocity accordingly
Particle.prototype.checkBoids = function(){
	//lolboidz
	
};

//This takes the new velocity and actually moves the particle
Particle.prototype.move = function(){
	
	this.checkBoids();
	this.position.add(this.velocity);
	
	this.tickLife();
};

//This returns the angle in terms of a vector
Particle.prototype.getAngle = function(){
	
	return this.position.getAngle();
};

Particle.prototype.tickLife = function(){
	
	if(this.life > 0){
		
		this.life--;
	}
	else{
		
		this.kill();
	}	
	
};

Particle.prototype.kill = function(){
	
	//console.log("A PARTICLE HAS DIED.");
	
	this.position = null;
	this.velocity = null;
	//this.life = 0;
	this.active = false;
};

Particle.prototype.activate = function(startPos, startSpeed, life){
	
	this.position = startPos;
	this.velocity = startSpeed;
	this.life = life;
	this.active = true;
	
	//window.setTimeout(this.kill.bind(this), this.life);
};