"use strict";

//Analytics offline support
//=========================

//TODO: Get events, save on localstorage and fire when online

//Constructor
var analytics = {};

analytics.track = function(action, additionalInfo, value){
	console.log('Analytics track (offline)', action, additionalInfo, value);

	return false;
};