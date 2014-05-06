var Particle = (function(){
	
	var posX;
	var posY;
	var obj;	
	
	var pub = {};
	/*Does not work...
	var randoStart = function(instanceNum){
		obj.style["-webkit-animation"]: ("wisp1 1s ease-out " + (instanceNum * 100) + "ms infinite, wispRise 1s ease-out " + (instanceNum * 100) + "ms infinite");
	};
	*/	
	
	pub.create = function (instanceNum, startX, startY){
			
		posX = startX;
		posY = startY;
		obj = document.createElement("div");
		
		if(instanceNum != undefined){
			obj.setAttribute("id", ("p" + instanceNum));
		}
		else{
			console.log("Something's going wrong when instantiating new particle IDs!");
			obj.setAttribute("id", "p0");
		}
				
		//randoStart(instanceNum); fails cuz editing css for non-finalized elements is terrible
		
		//But I really hate the below as well:
		if((instanceNum % 2) === 0){ //Alt animation
			obj.setAttribute("class", "particleShape1");
		}
		else if((instanceNum % 3) === 0){
			obj.setAttribute("class", "particleShape2");
		}
		else if((instanceNum % 4) === 0){
			obj.setAttribute("class", "particleShape3");
		}
		else if((instanceNum % 5) === 0){
			obj.setAttribute("class", "particleShape4");
		}
		else if((instanceNum % 6) === 0){
			obj.setAttribute("class", "particleShape5");
		}
		else{
			obj.setAttribute("class", "particleShape");
		}
		
		if(posX != undefined){
			obj.style.left = posX + "px";
			obj.style.top = posY + "px";
		}
		else{
			console.log("Something's going wrong when instantiating new particle positions!");
		}
		
		return this;
	};
	
	pub.getObj = function (){

		return obj;
	};
	
	pub.shiftX = function (amount){
		
		if(Math.random() > 0.5)
			posX = START_X + amount;
		else
			posX = START_X - amount;
		
		obj.style.left = posX + "px";
	};

	pub.shiftY = function (amount){
		
		if(Math.random() > 0.5)
			posY = START_Y + amount;
		else
			posY = START_Y - amount;
			
		obj.style.top = posY + "px";
	};
	
	return pub; 
	
})();