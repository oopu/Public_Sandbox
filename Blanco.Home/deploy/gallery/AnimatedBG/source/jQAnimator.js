var jQAnimator = (function (){
	
	var $activeSpriteArea;
	var spriteCSSResets = [
			{ top: "30px", left: "-300px", opacity: 1 },
			{ top: "100px", left: "-300px", opacity: 1 },
			{ top: "250px", left: "-300px", opacity: 1 },
			{ top: "480px", left: "-300px", opacity: 1 },
			{ top: "500px", left: "-300px", opacity: 1 },
			{ top: "550px", left: "-300px", opacity: 1 },
			{ top: "700px", left: "-300px", opacity: 1 },
			{ top: "800px", left: "-300px", opacity: 1 }
		];

	var pub = {};

	var init = function (){

		if($("#spriteArea-CSS").hasClass("hidden")){
			$activeSpriteArea = $("#spriteArea-SVG");
		}
		else{
			$activeSpriteArea = $("#spriteArea-CSS");	
		}
	};



	var animSprite = function ($sprite, givenDur, givenEase, givenDelay){

		$sprite.css({ "left": "-300px", "opacity": 1 });

		//Need to incorporate delay somehow...
		$sprite
			.animate({
				left: "+=2000px",
				opacity: 0
			},
			{
				duration: givenDur,
				easing: givenEase,
				complete: function (){ 
					//$sprite.css({ "left": "-300px", "opacity": 1 });
					animSprite($sprite, givenDur, givenEase, givenDelay);
				}
			});
	};

	pub.startAnim = function (){

		var i;
		var $curSprite;

		init();

		for( i = 0; i < $activeSpriteArea.children().length; i++)
		{	
			$curSprite = $($activeSpriteArea.children().eq(i));
			console.log("Messing with curSprite: " + $curSprite.attr("id"));
			
			if($curSprite.hasClass("thinner")){
				animSprite($curSprite, 2000, "swing", 5000);
			}
			else if($curSprite.hasClass("darker")){
				animSprite($curSprite, 4000, "linear", 500);
			}
			else if($curSprite.hasClass("babby")){
				animSprite($curSprite, 4000, "swing", 500);
			}
			else{
				animSprite($curSprite, 4000, "linear", 500);	
			}
		}
	};

	pub.stopAnim = function (){

		var i;
		var $curSprite;

		for( i = 0; i < $activeSpriteArea.children().length; i++ ){
			$curSprite = $($activeSpriteArea.children().eq(i));

			$curSprite
				.finish()
				.css({
					"top": spriteCSSResets[i].top,
					"left": spriteCSSResets[i].left,
					"opacity": spriteCSSResets[i].opacity
				});
		}
		
	};

	return pub;
})();