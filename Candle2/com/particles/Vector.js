//This defines the Vector class, which is used in all Particles to determine velocity and position
var Vector = function(x, y){
  
	this.x = x || 0;
    this.y = y || 0;
};
        
//add a vector to another
Vector.prototype.add = function(vector){
  
	this.x += vector.x;
    this.y += vector.y;
};
    
//get the length of the vector
Vector.prototype.getMagnitude = function(){
    
	return Math.sqrt(this.x * this.x + this.y * this.y);
};

//get the angle accounting for the quadrant we're in
Vector.prototype.getAngle = function(){
    
	return Math.atan2(this.y, this.x);
};

//allows us to get a new vector from angle and magnitude.
//Why is this not being added to the prototype like the rest, though?
Vector.fromAngle = function(angle, magnitude){
  
	return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
};