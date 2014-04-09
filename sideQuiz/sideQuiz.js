/** The following code is specifically for the sideQuiz widget.
* It is important to note that this code assumes that only a single instance of sideQuiz is present on the page.
*/
$(function (){
	
	var uncovered = false;
	var $distractors = $(".sideQuiz #distractorsContainer");
	
	var showFeedback = function ($givenDistractor){
	
		$(".sideQuiz #feedbackArea")
			.empty()
			.append($givenDistractor.next().clone().removeClass("feedback").attr("aria-hidden", "false"));
	};
	
	var simplerInputHandler = function (event){
		
		//event.preventDefault();
		showFeedback($(this));
		
		if($(this).hasClass("correct")){
			
			$(this).attr("aria-checked", "true");
			
			$(".sideQuiz #feedbackAckBtn")
				.fadeIn()
				.click(killMe);
			$distractors.find("input, button")
				.attr("aria-disabled", "true")
				.attr("disabled", "true");
		}
		/* Steve doesn't like this
		else if(($(this).attr("type") === "radio") || ($(this).attr("type") === "checkbox")){
			
			//clear the checked value
			
			$(this).removeAttr("checked");
			console.log("Checks should have been cleared");
			
		}*/
	};
		
	/** Cleanup function for removing event listeners and fading out the widget.
	* Triggered by clicking #feedbackAckBtn
	*/
	var killMe = function (){
		
		$distractors.off("click", "button");
		$(".sideQuiz")
			.off()
			.attr("aria-hidden", "true")
			.fadeOut();
	};
	
	$(".sideQuiz").click(function (event){
		
		if(!uncovered){
			
			//Aria visibility junk for screen readers
			$(".cover")
				.attr("aria-hidden", "true")
				.parent().css("display", "none");
			$(".content").attr("aria-hidden", "false");
			$distractors.attr("aria-hidden", "false");
			
			$(".sideQuiz .cover").fadeOut(500, function(){
				
				$(".sideQuiz .content").fadeIn();
				$distractors
					.on("click", "button", simplerInputHandler)
					.on("change", "input", simplerInputHandler); //A more generic handler for other types of inputs
			});
			$(this).css({
				"width": "auto",
				"max-width": "50%"
			});
			uncovered = true;
		}
	});
	
});