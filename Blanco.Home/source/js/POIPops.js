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
		
		$(event.currentTarget)
			.removeClass("anim-driftV")
			.removeClass("anim-driftV-offset")
			.children("i").eq(0).removeClass("fa-circle-o").addClass("fa-dot-circle-o");
		$(event.currentTarget)
			.children(".POIContent")
			.css({
				"width": ($(event.currentTarget).children(".POIContent").text().length / 4) + "em"
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