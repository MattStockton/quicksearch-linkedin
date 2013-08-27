var linked_in_search = function(searchText){
	var first_name = "";
	var last_name = "";
  
	if(searchText){
		var split_text = searchText.match(/[^ ]+/g);
		if(split_text.length >= 2){
			first_name = split_text[0];
			split_text.splice(0,1);
			last_name = split_text.join();
		}
	}

	var url = "http:localhost:5000/search.html";
	//http://linkedinsearch.s3-website-us-east-1.amazonaws.com/v1.0/search.html
  
	if(first_name && last_name){
		url += "?first_name=" + encodeURIComponent(first_name)   +  "&last_name=" + encodeURIComponent(last_name);
	} else {
		url += "?invalid_search=true";
	}

	chrome.tabs.create({
		url: url,
		active: false
	}, function(tab) {
		chrome.windows.create({
			tabId: tab.id,
			width: 425,
			height: 400,
			type: 'panel',
			focused: true
		});
	}); 
}

var linked_in_omnibox_handler = function(text, tab){
	linked_in_search(text);
}

var linked_in_context_handler = function(info, tab) {
	if (info.menuItemId == "linkedin_search") {
		linked_in_search(info.selectionText);
	}
}

chrome.omnibox.onInputEntered.addListener(linked_in_omnibox_handler)
chrome.contextMenus.onClicked.addListener(linked_in_context_handler);

chrome.runtime.onInstalled.addListener(function() {
	var context = "selection";
	var id = chrome.contextMenus.create({"title": "Search LinkedIn for '%s'", "contexts":[context],
	"id": "linkedin_search"});
});