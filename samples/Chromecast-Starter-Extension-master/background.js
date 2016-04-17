//open in new tab
document.addEventListener('DOMContentLoaded', function() {
	var newURL = "app.html";
    chrome.tabs.create({ url: newURL });
	chrome.tabs.executeScript( null, {code:"var x = 10; x"},
   function(results){ console.log(results); } );
	
	//check that Chromecast is init
	if (!chrome.cast || !chrome.cast.isAvailable) {
	  setTimeout(initializeCastApi, 1000);
	}
	initializeCastApi = function() {
	  var sessionRequest = new chrome.cast.SessionRequest(applicationID);
	  var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
		sessionListener,
		receiverListener);
	  chrome.cast.initialize(apiConfig, onInitSuccess, onError);
	};
});