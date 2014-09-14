/** The following code is specifically for the kc widget. Created by Chris Blanco (nowucblanco@gmail.com) 2014.
*	This code makes use of UIKit (getuikit.com) and Underscore (underscorejs.org)
* ---------
*/
(function ($){

	/** Use this function to show the quiz.
		* These parameters are optional and are to be assigned through a given options object.
		*	- quizID = ID string that refers to which .kc on the page should be controlled. If none is specified, the first instance of ".kc" is assumed.
		*	- isTF = Boolean that is used to enable special behavior for 2-choice questions.
		*				If this is true and there are < 3 distractors, the quiz will behave as though the correct answer was chosen regardless of choice selected.
		*				This is false by default for compatibility with older implementations.
		*	- maxAttempts = Integer that manually sets the maximum number of attempts before the quiz is considered failed and ends. This number is '3' by default.
		*	- callbackFxn = Function to be called when the quiz is completed.
		*/
	$.fn.kc = function (options){

		var $whichQuiz = $(this);	
		var $distractors = $whichQuiz.find(".distractorsContainer");
		var checkTF = false;
		var multiSelect = false;
		var failCount = 0;
		var callbackFn = function (){};

		var MAX_FAILS = 3;
		var CLEAR_ANSWERS_LABEL = "Clear Selected";
		var CHECK_ANSWERS_LABEL = "Submit Answer";
	
		/** Helper function to automatically add all the UIKit classes to the DOM elements of this quiz. Keeps template simple.
		*	Called upon init()
		*/
		var addUKClasses = function (){
			
			$whichQuiz.addClass("uk-panel uk-panel-box uk-panel-header")
			$whichQuiz.find(".content>p").addClass("uk-panel-title");
			$whichQuiz.find(".distractorsContainer button").addClass("uk-button uk-button-primary");
			$whichQuiz.find(".feedbackArea").addClass("uk-alert");
		};

		/** Helper function to automatically add all the base aria attributes to the DOM elements of this quiz. Keeps template simple.
		*	Called upon init()
		*/
		var addARIA = function (){

			$whichQuiz
				.find(".content").attr("aria-live", "assertive")
					.find(".distractorsContainer input").attr("aria-controls", "feedbackArea");
			$whichQuiz.find(".feedback").attr("aria-hidden", "true");
		};

		/** Checks for the number of failures to determine when to just give up and show the correct feedback.
		* 	Selection-handling functions should first check if this returns false. If so, continue normally.
		*	If this returns true, this will manually select the correct answers and clear the incorrect answers.
		*	If this returns true, you should then show the correct feedback and complete the quiz.
		*/
		var checkFails = function (){

			var i = 0;
			var $inputs;
			var $buttons;

			//console.log("Number of fails: " + failCount);

			if(failCount < MAX_FAILS){
				return false;
			}
			else{

				//Show the correct answers

				$inputs = $distractors.find("input");
				$buttons = $distractors.find("button");

				if($inputs.length > 0){
					//This is a radial or checkbox-based quiz

					$inputs.prop("checked", false);
					//console.log("Manually set distractors to DEselected.");	

					for(i = 0; i < $inputs.length; i++){

						if($inputs.eq(i).hasClass("correct")){
							$inputs.eq(i).prop("checked", true);
							//console.log("Manually set distractor " + i + " to selected.");
						}
					}
				}
				else{
					//This is a button-based quiz and must be handled differently
					$buttons.removeClass(".clickedBtn");

					for(i = 0; i < $buttons.length; i++){
						if($buttons.eq(i).hasClass("correct")){
							$buttons.eq(i).addClass("clickedBtn");
						}
					}
				}

				//console.log("Done setting answer(s)");

				return true;
			}
		};

		/** This function is called if neither isTF or isMulti are defined in the init options.
		* 	This function will automatically make this a multiple-select quiz if there are more than two correct answers and the above is undefined.
		*/
		var checkIfMultiSelect = function (){

			var numCorrect = 0;

			for(var i = 0; i < $distractors.find("input").length; i++){

				if($distractors.find("input").eq(i).hasClass("correct")){
					numCorrect++;
				}
			}

			if(numCorrect > 1){

				multiSelect = true;
				makeMultiSelect();
			}
			else {

				$distractors
					.off("click").off("change")
					.on("click", "button", simplerInputHandler)
					.on("change", "input", simplerInputHandler); //A more generic handler for other types of inputs	
			}
		};

		/** This function is called if neither isTF or isMulti are defined in the init options.
		* 	This function will automatically make this a True or False quiz if there are only two distractors and the above is undefined.
		*/
		var checkIfTF = function (){

			if($distractors.children().length < 3){

				checkTF = true;
				//makeTF(); //No such function yet
			}
			else {

				$distractors
					.off("click").off("change")
					.on("click", "button", simplerInputHandler)
					.on("change", "input", simplerInputHandler); //A more generic handler for other types of inputs	
			}
		};

		/** This function is called if the popQuiz is initialized with multiSelect = true at init.
		*	This changes all inputs to type="checkbox", appends a "Check Answers" button, and changes the input handler.
		*/
		var makeMultiSelect = function (){

			//change distractors' input types to "checkbox"
			$distractors.find("input").attr("type", "checkbox");
			
			//append a "Check Answers" button (USE ICONS)
			$distractors.after("<button class='clearAnswersBtn uk-button uk-button-small uk-button-link' disabled>" + CLEAR_ANSWERS_LABEL + "</button>");
			$whichQuiz.append("<button class='checkAnswersBtn uk-button'>" + CHECK_ANSWERS_LABEL + "</button>");
			
			//Since click handlers were not assigned to distractors in init(), assign handler to multiInputHandler
			$distractors.off("change").on("change", "input", checkSelected); //checkSelected looks for selected checkboxes. If at least one is, enable checkAnswersBtn. Otherwise, disable it.
		};

		var showFeedback = function ($givenDistractors, isCorrect, failed){
			
			var $feedbackArea = $whichQuiz.find(".feedbackArea");

			//first, restyle the feedback accordingly
			$feedbackArea
				.removeClass("uk-alert-success")
				.removeClass("uk-alert-warning");

			$feedbackArea
				.empty()
				.css("opacity", 0);

			//Show general feedback
			if(isCorrect){ 
				$feedbackArea.addClass("uk-alert-success"); 
				$feedbackArea.append($whichQuiz.find(".allCorrect.feedback").clone().removeClass("feedback").attr("aria-hidden", "false"));
			}
			else if(failed){
				//$feedbackArea.addClass()
				$feedbackArea.append($whichQuiz.find(".maxFails.feedback").clone().removeClass("feedback").attr("aria-hidden", "false"));
			}
			else{ 
				$feedbackArea.addClass("uk-alert-warning");	
				
				if(!checkTF){ //Don't show this, because it can be misleading. Quiz is now over.
					$feedbackArea.append($whichQuiz.find(".incorrect.feedback").clone().removeClass("feedback").attr("aria-hidden", "false"));
				}
			}

			//Now show individual feedback
			_.each($givenDistractors, function(distractor){
				if($(distractor).nextAll(".feedback")){
					$feedbackArea.append($(distractor).nextAll(".feedback").clone().removeClass("feedback").attr("aria-hidden", "false"));	
				}			
			});

			$feedbackArea.animate({"opacity": 1});
		};
		
		var completeQuiz = function (){
			
			$whichQuiz.find(".clearAnswersBtn").off("click").prop("disabled", true);

			$distractors
				.addClass("disabled")
				.find("input, button")
					.attr("aria-disabled", "true")
					.attr("disabled", "true");

			callbackFn();
		};

		var simplerInputHandler = function (e){
			
			e.preventDefault();
				
			$distractors.find("button").removeClass("clickedBtn");
			if($(this).is("button")){ $(this).addClass("clickedBtn"); }
			
			if($(this).hasClass("correct")){
				
				showFeedback($(this), true);

				$(this).attr("aria-checked", "true");

				completeQuiz();
			}
			else if(($distractors.children().length < 3) && checkTF){
				//console.log("Marking as complete anyway because durr (there are only two options).");

				showFeedback($(this), false);

				completeQuiz();
			}
			else{

				failCount++;

				if(checkFails()){

					showFeedback($distractors.find("input:radio:checked"), false, true);
					completeQuiz();

					return;
				}
				else{
					showFeedback($(this), false);	
				}			
			}
		};

		/**Handles toggling of the checkAnswersBtn based on inputs being selected or not. Triggered upon click of distractors.
		*/
		var checkSelected = function (e){

			var $checkAnswersBtn = $whichQuiz.find(".checkAnswersBtn");
			var $clearAnswersBtn = $whichQuiz.find(".clearAnswersBtn");

			e.preventDefault();

			//In case trying again, bring back button
			$checkAnswersBtn.prop("disabled", false);
			$whichQuiz.find(".feedbackArea").empty().css("opacity", 0);

			if($distractors.find("input:checkbox:checked").length){
				//console.log("Stuff is selected");

				$clearAnswersBtn
					.prop("disabled", false)
					.on("click", function (){
						$distractors.find("input").prop("checked", false);
						$distractors.find("input").parent().find("i").remove();
						$(this).prop("disabled", true).off("click");
					});

				//Only run this once
				if(!$checkAnswersBtn.hasClass("active")){

					$checkAnswersBtn.addClass("active").on("click", multiInputHandler);	
				}
			}
			else{
				//console.log("Nothing is selected");
				$clearAnswersBtn.prop("disabled", true).off("click");
				$checkAnswersBtn.removeClass("active").off("click", multiInputHandler);
			}
		};

		//Handles interpretation of selected inputs and displaying of feedback, as well as completion of quiz.
		var multiInputHandler = function (e){

			var allTrue = true; 
			var $thisDistractor = {};
			var numDistractors = $distractors.find("input:checkbox").length;
			
			e.preventDefault();

			//console.log("Checking answers");

			for(var i = 0; i < numDistractors; i++){

				//console.log("Checking distractor " + i);
				$thisDistractor = $($distractors.find("input:checkbox").eq(i));
				$thisDistractor.parent().find("i").remove();

				if($thisDistractor.is(":checked") && $thisDistractor.hasClass("correct")){
					//console.log("This one was selected and was correct!");
					
					$thisDistractor.before("<i class='uk-icon-check'></i>");
				}
				else if( ($thisDistractor.is(":checked")) || (!$thisDistractor.is(":checked") && $thisDistractor.hasClass("correct")) ) {
					//console.log("This one was selected and wasn't correct, or this one wasn't selected and WAS correct.");
					
					if(!$thisDistractor.hasClass("correct")){

						//Otherwise, this would always give people the answers without any thought.
						$thisDistractor.before("<i class='uk-icon-times'></i>");	
					}
					
					allTrue = false;
				}
			}
			
			//It is important that this is called before the rest because this would clear the overall "Congrats!" message.
			showFeedback($distractors.find("input:checkbox:checked"), allTrue);

			if(allTrue){
				//Do things because quiz is all done

				$whichQuiz.find(".checkAnswersBtn").prop("disabled", true);
				completeQuiz();
			}
			else{
				//Do different things because quiz is answered wrong
				failCount++;

				if(checkFails()){

					showFeedback($distractors.find("input:checkbox:checked"), false, true);
					$whichQuiz.find(".checkAnswersBtn").prop("disabled", true);	
					completeQuiz();				
					
					return;
				}
				else{
					$whichQuiz.find(".checkAnswersBtn").prop("disabled", true);	
				}
				
			}
		};

		if(options){

			checkTF = options.isTF || false;
			multiSelect = options.isMulti || false;
			
			if(options.maxAttempts){
				MAX_FAILS = options.maxAttempts;
			}
			if(options.callbackFxn){
				callbackFn = options.callbackFxn;
			}
		}

		//Special case: check to see if actually should be multi-select just in case of user error
		if(!checkTF && !multiSelect){
			checkIfTF();
			checkIfMultiSelect();			
		}
		else if(multiSelect) {
			makeMultiSelect();
		}
		else{
			$distractors
				.off("click").off("change")
				.on("click", "button", simplerInputHandler)
				.on("change", "input", simplerInputHandler); //A more generic handler for other types of inputs	
		}
		
		addUKClasses();
		addARIA();

		return this;
	};

}(jQuery));