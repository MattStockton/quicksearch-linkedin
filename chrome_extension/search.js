function linkedInSearchHandler(info, tab) {
  if (info.menuItemId == "linkedin_search") {
	  var first_name = "";
	  var last_name = "";
	  
	  if(info.selectionText){
		  var split_text = info.selectionText.split(" ");
		  if(split_text.length >= 2){
			  first_name = split_text[0];
			  split_text.splice(0,1);
			  last_name = split_text.join();
		  }
	  }
	  
	  if(first_name && last_name){
		  //http://linkedinsearch.s3-website-us-east-1.amazonaws.com/v1.0/search.html
		  var url = "http:localhost:5000/search.html?first_name=" + encodeURIComponent(first_name)   +  "&last_name=" + encodeURIComponent(last_name);
		  chrome.tabs.create({
		              url: url,
					  active: false
				  }, function(tab) {
		              // After the tab has been created, open a window to inject the tab
		              chrome.windows.create({
		                  tabId: tab.id,
						  width: 425,
						  height: 400,
		                  type: 'panel',
		                  focused: true
		                  // incognito, top, left, ...
		              });
		          }); 
	  }
  }
};

chrome.contextMenus.onClicked.addListener(linkedInSearchHandler);

chrome.runtime.onInstalled.addListener(function() {
    var context = "selection";
    var id = chrome.contextMenus.create({"title": "Search LinkedIn", "contexts":[context],
                                         "id": "linkedin_search"});
});