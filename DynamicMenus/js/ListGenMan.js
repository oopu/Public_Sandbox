/** This module provides functions to build the DOM elements that contain the data from the JSON loaded by JSONMan.
* This module is used exclusively by JSONMan and thus MUST BE LOADED FIRST.
* It exposes two functions: genListItem() and genList(), which are defined below.
*/
var ListGenMan = (function (){
	
	var pub = {};

	/** This function takes the given JSON data for a given list item and its parent list and creates the DOM element within the list.
	* Inputs:
	*	- listItem (Object): The JSON data for the individual list item
	*	- parentList (Object): The parent object that this item should be appended to
	* Returns the list item object
	*/
	pub.genListItem = function (listItem, parentList){

		var item = document.createElement("li");
		var link = document.createElement("a");
		var linkText = document.createTextNode(listItem.name);
		var linkIcon = document.createElement("i");
		
		if(listItem.links.length > 0){
			linkIcon.setAttribute("class", "fa fa-chevron-right");
			link.appendChild(linkIcon);	
		}
		link.appendChild(linkText);
		link.setAttribute("href", listItem.url);

		item.appendChild(link);

		parentList.appendChild(item);

		return item;
	};

	/** This function generates a new list object for list items to be appended to.
	* Returns the generated list object for use elsewhere.
	*/
	pub.genList = function (){

		var thisList = document.createElement("ul");

		//console.log("Generating new list");
		
		return thisList;
	};

	return pub;
})();