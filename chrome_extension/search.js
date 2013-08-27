var linked_in_search_handler = function(info, tab) {
	if (info.menuItemId == "linkedin_search") {
		var first_name = "";
		var last_name = "";
	  
		if(info.selectionText){
			var split_text = info.selectionText.match(/[^ ]+/g);
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
}

chrome.contextMenus.onClicked.addListener(linked_in_search_handler);

chrome.runtime.onInstalled.addListener(function() {
	var context = "selection";
	var id = chrome.contextMenus.create({"title": "Search LinkedIn for '%s'", "contexts":[context],
	"id": "linkedin_search"});
});