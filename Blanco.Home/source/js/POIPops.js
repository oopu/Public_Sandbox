$(function (){

	var activePOI = {};

	//hide all active popups
	var hidePopups = function (useFade){
		var fade_duration = useFade ? 400 : 0;
		$(".POIContent").attr("aria-hidden", "true").fadeOut(fade_duration); 
		$(document).off("click", hidePopups);		
		if(activePOI){ $(activePOI).click(showContent); }
	}

	var showContent = function (event){
		
		event.preventDefault();

		//Ensure no popups are visible
		hidePopups();
		
		activePOI = event.currentTarget;

		$(activePOI)
			.removeClass("anim-driftV")
			.removeClass("anim-driftV-offset")
			.children("i").eq(0).removeClass("fa-circle-o").addClass("fa-dot-circle-o");
		$(activePOI)
			.children(".POIContent")
			.css({
				"width": ($(activePOI).children(".POIContent").text().length / 4) + "em"
			})
			.attr("aria-hidden", "false")
			.fadeIn(function (){
				
				$(document)
					.keydown(function (event){
						if(event.keyCode == 27){ hidePopups(true); }
					})
					.click(hidePopups);
				$(activePOI).off("click", showContent);
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