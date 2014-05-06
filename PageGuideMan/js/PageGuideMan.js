/** Modularized version of PageGuide.js use combined with Point of interest hit tracking and page transition target tracking
*	Requires pageguide.js and jQuery to have been loaded. 
*	Be sure to call assignClickTarget() and initGuide() only after $(window).load has fired (or when the DOM is otherwise ready).
*	Use goToPOI() to skip straight to a specific point of interest. (This assumes the guide is already active).
*	Use openGuide() and closeGuide() for ... self-explanatory actions.
* 	
*	Designed to work with pageguide.js v1.2.0 and my modified pageguide.css (and pageguide.ie8.css) file.
*	This was originally developed by Chris Blanco for use at FireEye in the Training department.
*
*	TO DO:
*		- Clean up POI references; data-tour_target can be used for all things if I write a longer query string, allowing for idString arguments
*		- Unify assignPOIAction() and assignClickTarget() to use idStrings
*		- Allow assignPOIAction() and assignClickTarget() to take idStrings OR ints as arguments
*/

var PageGuideMan = (function (){

	var pgHandle;
	var targetsHit = [];
	var assignedActions = []; //array of the same size as the number of targets which holds functions created by use of assignPOIAction().
	var numHit = 0;
	var skippy = false; //used to skip transition animations. Currently only manipulated by goToPOI().
	var noClickTarget = true; //used to determine whether or not a clicktarget has been assigned to cause this activity to transition into the next one. Set by assignClickTarget.
	var old_show_message; //Hoisted this here. I extend pageguide.js' "show_message" function to improve message area resizing when messages are changed.
	/** This private function is used to abstract the checking of targets hit. 
	* Returns:
		- TRUE if all targets are hit (according to targetsHit[])
		- FALSE if not
	*/
	var checkTargetsHit = function (){
		
		numHit = 0;
				
		for(var i = 0; i < targetsHit.length; i++){
		
			if(targetsHit[i])
			{
				numHit++;
			}
		
		}
		
		if(numHit === targetsHit.length){
			
			return true;
		}
		else{
			
			return false;
		}		
	};
	
	/** This private function is used to abstract the resizing of the message window. It is called on the handle_doc_switch event.
	*/
	var resetMessageHeight = function (){
		
		//console.log("Resetting Messages area");
		//console.log("Given message: " + $incMessage.html());
		var messageHeight = $("#tlyPageGuideMessages").children("div").outerHeight() + 32; //plus a little padding
		
		if(messageHeight >= 100){
			
			pgHandle.$message.css("height", messageHeight + "px");
		}
		else{ pgHandle.$message.css("height", "100px"); }
	};
	
	var pub = {};
	
	/** Use this function to assing a clickable target to be used to trigger cross-activity navigation from the course wrapper.
	* Inputs:
		- $target = a jQuery object
		- quietTransition = a Boolean to indicate whether or not to silently request the next slide on click (TRUE) or to display
							the navigation controls normally (FALSE). Default is TRUE.
	*/
	pub.assignClickTarget = function ($target, quietTransition){
		
		//console.log("Assigning click target ...");
		
		if(quietTransition === undefined){ 
			
			quietTransition = true; 
		};
		
		$target.click(function (event){
			
			event.preventDefault();
			
			if(quietTransition){
			
				//Call Philip's transition request forward without showing arrow
				parent.$("body").trigger("FEYE.activityComplete").trigger("FEYE.go.next");
			}
			else{
				parent.$("body").trigger("FEYE.activityComplete").trigger("FEYE.insertNavigation"); //latter event is untested!
			}
		});
		
		noClickTarget = false;
	};
	
	/* Call this function to assign a function to a given POI index (decremented from what's onscreen) when that POI is activated.
	*	Note that this function will be triggered EVERY TIME the POI is hit.
	* 	Inputs:
			- whichPOI: int representing the index (-1 from what's shown onscreen) for a POI.
			- funct: function to be called when whichPOI is hit
	*/
	pub.assignPOIAction = function (whichPOI, func){
		
		assignedActions[whichPOI] = func;
	};

	/** Call this function to cause the PageGuide to skip directly to a given point of interest.
	* If the guide was not already open, it will be opened first. 
	*	Inputs:
	*		- whichPOI: int representing the index (-1 from what's shown onscreen) for a POI.
	*/
	pub.goToPOI = function (whichPOI){
		
		//Bypass animations while the guide is reopened.
		skippy = true;
		
		if(!pgHandle.is_open){
		
			pgHandle.open();
		}
		
		//Guide is now open. Stop bypassing animations.
		skippy = false;
		pgHandle.show_message(whichPOI);		
	};
	
	
	/** Use this to directly close the PageGuide. If the PageGuide was not already open, this function does nothing.
	*/
	pub.closeGuide = function (){
	
		if(pgHandle.is_open){
			
			pgHandle.close();
			//console.log("Guide closed.");
		}
	};
	
	/** Use this to directly open the PageGuide and bypass the welcome screen. If the PageGuide was already open, this function does nothing.
	*/
	pub.openGuide = function (){
	
		if(!pgHandle.is_open){
			
			pgHandle.open();
		}
	};
	
	/** Call this function to initiate the PageGuide plugin with the default settings being used for this lesson and with its points of interest.
	* Inputs:
	*	- targetIDs - An array of ID strings, to be prepended with "#", as in "#POI"!
	*	- targetClassName - A string containing the class name of the targetIDs, to be prepended with ".", as in ".POIDiv"
	*	- onComplete - A function to be called when all targets have been hit
	*	- autoStart - A Boolean value to determine whether or not the initGuide call should also immediately open the guide. Default is FALSE (do not automatically open).
	*/
	pub.initGuide = function (targetIDs, targetClassName, onComplete, autoStart){

		var i = 0;
		
		//console.log("Initializing PageGuide ...");
		
		for(i = 0; i < targetIDs.length; i++){
			
			targetsHit.push(false);
			assignedActions.push(undefined);
		}
		//console.log("targetsHit array initiated with " + targetsHit.length + " values");
	
		pgHandle = tl.pg.init({
			
			auto_show_first: true,
			pg_caption: "Toggle Guide",
			dismiss_welcome: function (){ return false; },
			track_events_cb: function (event){ 
				
				if(event === "PG.close"){
					
					//Stop animations currently running and fade out all target overlays
					$(targetClassName)
						.clearQueue()
						.animate({ opacity: "0"}, 500);
				}
			},
			handle_doc_switch: function(cur_target, prev_target){
				
				if(!skippy){
					//Fade out all target overlays
					$(targetClassName).animate({ opacity: "0"}, 500);
				}
				
				for(i = 0; i < targetsHit.length; i++){
					
					if(targetIDs[i] === cur_target){
					
						targetsHit[i] = true; //what matters is that all guides are marked as true, not that an individual index matches an individual ID in some order
						//console.log("Marked target " + i + " as having been hit");
						
						if(cur_target != prev_target){ //this prevents the first one from immediately being marked
														
							$("#tlyPageGuide").find("li[data-tourtarget*=" + prev_target + "]").addClass("visitedPOI"); //dat selection. :F
						}
						
						//console.log("Calling assigned action on this target, if any");
						if(assignedActions[i]){
							
							assignedActions[i]();
							pgHandle.position_tour();
						}
						break;
					}
				}
				
				if(!skippy){
					//Fade in the current target's overlay
					$(cur_target).animate({ opacity: "1"}, 500);
				}
								
				if(checkTargetsHit()){
					
					//console.log("All targets hit");
					
					if(noClickTarget){
						if($("#tlyPageGuide li div").find(".continueLink").length <= 1){
							//console.log("Inserting click to continue link");
							
							/* The below was useful when this was a part of a course enclosed by the course wrapper we used. This would provide a link to trigger the below events, which is not useful here but included for reference. Read on for more info.
							$("#tlyPageGuide li div").append('<a class="continueLink" href="#">Click here to continue to the next activity.</a>'); */
													
							//This is created to listen for clicks on the "continueLink"
							$("#tlyPageGuideMessages").on("click", ".continueLink", function (){
															
								//console.log("Link clicked. Continuing to next activity.");
								/* The below was useful when this was a part of a course enclosed by the course wrapper we used. This would trigger events to complete the current activity and trigger the load of the next activity.*/
								parent.$("body").trigger("FEYE.activityComplete").trigger("FEYE.go.next");
							});
						}
					}
					
					if(onComplete){
						
						onComplete();
					}
				}
			}
		}); 
		
		//This allows the PageGuide to be reopened if someone clicks a POI while the guide was closed. It skips straight to the POI that was clicked once opened.
		$(targetClassName).click(function (){ 
				
			for(var i = 0; i < $(targetClassName).length; i++){
				
				if($(this).is($(targetClassName).eq(i)))
				{
					break;
				}
			}
			PageGuideMan.goToPOI(i)
		});
		
		//extend the current show_message function with my resize function:
		old_show_message = pgHandle.show_message;
		
		pgHandle.show_message = function (){
			
			old_show_message.apply(this, arguments);
			resetMessageHeight();
		}
		
		if(autoStart){
		
			pub.openGuide();
		}
	};
	
	return pub;
})();