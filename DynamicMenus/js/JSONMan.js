/** ------- Be sure to load ListGenMan.js first! -------- 
* Though not the most ideal setup, as far as module relationships go, this module is responsible for loading an external JSON file and using ListGenMan to create a navList from it.
* It is currently hard-coded to load from the url "//nowucblanco.me/sandbox/links.json", which is my server. This could be refactored to accept a URL upon init in addition to the DOM element to init the list within.
* It only exposes the init() function, which is described below.
*/
var JSONMan = (function (){
		
	var pub = {};

	/** Function to initiate the HTTP request. Called on init.
	* Inputs: 
	*	- callbackFn (function): Callback function to be called upon successful return of the object.
	*	Note that this currently loads synchronously due to the conditions of the test, making use of the callback function a little unnecessary.
	*/
	var loadJSON = function (callbackFn){

		var xobj = new XMLHttpRequest();

		//This is a CORS-enabled server for GET requests from all origins. This file is located in an un-linked directory on my AWS server.
		//Because there's nothing worth showing until this is done, I'm running the request synchronously.
		xobj.open("GET", "//nowucblanco.me/sandbox/links.json", false);
						
		xobj.onreadystatechange = function (){
			if (xobj.readyState === 4 && xobj.status === 200) {

				callbackFn(xobj.responseText);
			}
			else
			{
				//console.log("Having issues loading...");
			}
		};
		xobj.send();
	};

	/** Function to take a given link and add it to an existing list element. Called by traverseLinks.
	* Inputs: 
	*	- givenLink (Object): The link object from the loaded JSON, containing name, url, and links values
	*	- owningList (Object): The DOM element to receive this list item
	*/
	var parseLink = function (givenLink, owningList){

		//console.log("Link name: " + givenLink.name);

		var item = ListGenMan.genListItem(givenLink, owningList);

		if(givenLink.links.length > 0){
			//console.log("Nested links!");
			traverseLinks(givenLink, item);
		}
	};

	/** Function to take a given list object from JSON and create individual links from it. Called recursively as a part of the HTTP request completion callback
	* Inputs: 
	*	- rootLink (Object): The root list object from the loaded JSON
	*	- parentLElement (Object): DOM object that this list will be appended to
	* Returns the list object, filled with whatever link elements were generated.
	*/
	var traverseLinks = function (rootLink, parentElement){

		var list = ListGenMan.genList();

		for(var i = 0; i < rootLink.links.length; i++){
	
			parseLink(rootLink.links[i], list);
		}
		if(parentElement)
		{
			parentElement.appendChild(list);
		}
		return list;
	};

	/** Public function that starts the JSON load request and then populates the given container.
	* Inputs:
	*	- containerID (ID string): The string (without a hash mark) that is the ID of the container in the DOM that will receive this generated list.
	*/
	pub.init = function (containerID){

		loadJSON( function (response){
		
			var loadedObj = JSON.parse(response);
		
			var generatedLinks = traverseLinks(loadedObj, document.getElementById(containerID));

			//document.getElementById(containerID).appendChild(generatedLinks);
		});
	};

	return pub;

})();