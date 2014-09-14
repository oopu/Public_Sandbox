/** This module is used to control a drawer-type widget in a given page. 
* It must be given a jQuery object containing the drawer content and the width of of the content to be hidden.
* This module does not currently dynamically track the current/active task; it simply looks for the CSS class ".active" and changes it to ".complete" when updateTaskList() is called.
*
* To pop open and mark the currently active task as complete manually, call updateTaskList(). Mouse clicks on the task list will also pop it open but will not change any CSS classes.
*
* Note that $(window) assignments have been commented out for cross-browser compatibility.
*
* Sample HTML for the task list:

		<aside class="TaskDrawer">
			<h3>Tasks:</h3>
			<ol>
				<li class="completed">Run the configuration jump-start</li>
				<li class="active">Log on to the Web UI and change password</li>
				<li class="pending">License the appliance</li>
				<li class="pending">Run the Health Check</li>
				<li class="pending">Run the Deployment Check</li>
			</ol>
		</aside>
		
			...
			
		<script>
			$(function (){
								
				TaskDrawerMan.init($(".drawer-right"));
			});
		</script>
		
* Contact Chris Blanco (christopher.blanoc@fireeye.com) for any questions.
*/

var TaskDrawerMan = (function (){

	var $taskDrawer;
	var hiddenWidth;
	var drawerOpen = false;
	var listUpdated = false; //Set once after updateTaskList() is called, preventing later calls
	
	var updateIcons = function (){
		
		var $listedTasks = $taskDrawer.find("li");
		
		for(var i = 0; i < $listedTasks.length; i++){
			
			if($listedTasks.eq(i).hasClass("completed")){
				
				$listedTasks.eq(i).find("i").removeClass("fa-square-o").addClass("fa-check-square-o");
			}
		}
	};
	
	var pub = {};
	
	pub.init = function(givenWidth, $givenDrawer){
		
		if(!$givenDrawer){ $taskDrawer = $(".TaskDrawer"); }
		else { $taskDrawer = $givenDrawer; }
		
		if(!givenWidth){ hiddenWidth = 534; }
		else{ hiddenWidth = givenWidth; }
		
		updateIcons();
		
		$taskDrawer.hover(
			
			//when hovering over it...
			function (){
			
				if(!drawerOpen){
				
					$(this)
						.clearQueue()
						.animate({
							right: "-" + (hiddenWidth - 30) + "px"
						});
				}
			},
			
			//when hovering away from it...
			function (){
				
				if(!drawerOpen){
				
					$(this)
						.clearQueue()
						.animate({
							right: "-" + hiddenWidth + "px"
						});
				}
			}
		);
		
		$taskDrawer.click(function (){
				
			$(this).animate({
				right: "0px"
			}, 400, function (){ 
				
				drawerOpen = true;
				
				//$(window).keyup(function (event){
				$(document).keyup(function (event){
					
					if(event.keyCode == 27){
					
						$taskDrawer.clearQueue().animate({
							right: "-" + hiddenWidth + "px"
							}, 400, function (){
								
								drawerOpen = false;
								
								//$(window)
								$(document)
									.off("keyup")
									.off("click");
						});
					}
				});
				
				//console.log("What's in $(window)? " + $(window));
				
				//$(window).click(function (){
				$(document).click(function (){
					
					//console.log("Window click detected!");
					
					$taskDrawer.clearQueue().animate({
						right: "-" + hiddenWidth + "px"
						}, 400, function (){
								
								drawerOpen = false;
								
								//$(window)
								$(document)
									.off("keyup")
									.off("click");								
					});
				});
			});
		});
	};
		
	pub.updateTaskList = function (force){
		
		if(!listUpdated || force){
			
			$taskDrawer.trigger("click");
			
			window.setTimeout(function (){
				$taskDrawer.find(".active")
					.removeClass("active")
					.addClass("completed")
					.next().addClass("active");			
					
					updateIcons();
				}, 1000);
			listUpdated = true;
			
			window.setTimeout(function (){
				
				$(document).trigger("click");
			}, 2000);			
		}
	};
		
	return pub;
})();