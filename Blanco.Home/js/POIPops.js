$(function (){

	//hide all active popups
	var hidePopups = function (useFade){
		var fade_duration = useFade ? 400 : 0;
		$(".POIContent").attr("aria-hidden", "true").fadeOut(fade_duration); 
		$(document).off("click", hidePopups);
	}

	var showContent = function (event){
		
		event.preventDefault();

		//Ensure no popups are visible
		hidePopups();
		
		$(event.target)
			.css({
				"color": "rgb(200, 16, 46)",
				"background-color": "rgb(29, 37, 45)"
			})
			.children(".POIContent")
				.css({
					"width": ($(event.target).children(".POIContent").text().length / 4) + "em"
				})
				.attr("aria-hidden", "false")
				.fadeIn(function (){
					
					$(document)
						.keydown(function (event){
							if(event.keyCode == 27){ hidePopups(true); }
						})
						.click(hidePopups);
				});
				
	
	};
					
	$(".POIDot")
		.click(showContent)
		.keydown(function (event){
			
			if(event.keyCode == 13){
				
				showContent(event);
			}
		});
});