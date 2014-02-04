//Helpers
//=======

//Local Storage
window.savedUserInfo = {
	//Get saved info as OBJECT
	get: function(Item, callback) {
		if(typeof chrome != 'undefined' && chrome.storage) {
			chrome.storage.local.get(Item, function(result){ 
				//Callback
				if(typeof callback == 'function') callback.call(this, result[Item]);
			});
		} else {
			var result = localStorage.getItem(Item) ? $.parseJSON(localStorage.getItem(Item)) : null;
			
			//Callback
			if(typeof callback == 'function') callback.call(this, result);
		}
	},

	//Save info in OBJECT
	set: function(Item, Info, callback){
		var obj = {};
		obj[Item] = Info;

		if(typeof chrome != 'undefined' && chrome.storage) {
			chrome.storage.local.set(obj, function(result){
				
				//Callback
				if(typeof callback == 'function') callback.call(this, result);
			});
		} else {
			//Remove item
			if(Info === null) {
				var result = localStorage.removeItem(Item);
			} 

			//Update item
			else {
				var result = localStorage.setItem(Item, stringify(Info));
			}
			
			//Callback
			if(typeof callback == 'function') callback.call(this, result);
		}

		return obj;
	}
};

//To Array Helper
window.toArray = function(list){return Array.prototype.slice.call(list || [], 0);};

//Reset saved user info
window.resetUserInfo = function(){
	savedUserInfo.set('playlist.entries', null);
	savedUserInfo.set('playlist.play', null);
	savedUserInfo.set('playlist.volume', null);
	return true;
};

//Append CSS in player
window.appendCSS = function(path){
	$('head').append('<link rel="stylesheet" href="/masterPlayer/' + path + '" type="text/css" />');
};

//Append secondary box in player
window.appendSecondaryBox = function(boxId, boxName, content) {
	var html = '<div id="' + boxId + '" class="secondary-box"> \
					<div class="box-container"> \
						<div class="box-header"> \
							<h3>' + boxName + '</h3> \
							<a href="#" class="ico-close box-close box-actions" title="Close this box"></a> \
							<span class="clearfix"></span> \
						</div> \
						<div class="box-content">' + content + '</div> \
					</div> \
				</div> \
	';

	return $(html).appendTo($('.jp-type-playlist','#jp_container'));
};

//Append blank box in player
window.appendBlankBox = function(boxId, boxName, content) {
	var html = '<div id="' + boxId + '" class="blank-box animated fadeInRight"> \
					<div class="box-container"> \
						<div class="box-content">' + content + '</div> \
					</div> \
				</div> \
	';

	return $(html).appendTo($('.jp-type-playlist','#jp_container'));
};

//Transform image to base64
window.convertImgToBase64 = function(url, callback, outputFormat){
	var canvas = document.createElement('CANVAS');
	var ctx = canvas.getContext('2d');
	var img = new Image;
	img.crossOrigin = 'Anonymous';
	
	img.onload = function(){
		canvas.height = img.height;
		canvas.width = img.width;
		ctx.drawImage(img,0,0);
		var dataURL = canvas.toDataURL(outputFormat || 'image/png');
		callback.call(this, dataURL);
		// Clean up
		canvas = null; 
	};
	img.src = url;
};