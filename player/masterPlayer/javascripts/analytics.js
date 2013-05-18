//Google Analytics support
//========================
var _gaq = _gaq || [];
var pluginUrl = '//www.google-analytics.com/plugins/ga/inpage_linkid.js';
_gaq.push(['_require', 'inpage_linkid', pluginUrl]);
_gaq.push(['_setAccount', 'UA-9488577-3']);
//_gaq.push(['_setDomainName', 'herokuapp.com']);
_gaq.push(['_setDomainName', 'none']);
_gaq.push(['_setAllowLinker', true]);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

//Track events
//============

//Constructor
var analytics = {};

analytics.track = function(action, additionalInfo, value){
	var result =  this['_'+action].call(this, additionalInfo, value);

	//Google Analytics
	_gaq.push(['_trackEvent', result.categoty, result.action, result.label, result.value]);

	console.log('Analytics track', result);

	return result;
};

//Play music
analytics._playMusic = function(additionalInfo, value) {
	return {
		categoty: 'MusicControl',
		action: 'Play',
		label: additionalInfo || null
	};
};

//Pause music
analytics._pauseMusic = function(additionalInfo, value) {
	return {
		categoty: 'MusicControl',
		action: 'Pause',
		label: additionalInfo || null,
		value: value || null
	};
};

//Next music
analytics._nextMusic = function(additionalInfo, value) {
	return {
		categoty: 'MusicControl',
		action: 'Next',
		label: additionalInfo || null,
		value: value || null
	};
};

//Previous music
analytics._prevMusic = function(additionalInfo, value) {
	return {
		categoty: 'MusicControl',
		action: 'Previous',
		label: additionalInfo || null,
		value: value || null
	};
};

//Music progress
analytics._musicProgress = function(additionalInfo, value){
	return {
		categoty: 'MusicControl',
		action: 'Progress',
		label: additionalInfo || null,
		value: value || null
	};
};

//Change music
analytics._changeMusic = function(additionalInfo, value){
	return {
		categoty: 'PlaylistControl',
		action: 'ChangeMusic',
		label: additionalInfo || null,
		value: value || null
	};
};


//Toggle Shuffle
analytics._shuffle = function(additionalInfo, value) {
	return {
		categoty: 'PlaylistControl',
		action: 'Shuffle',
		label: additionalInfo || null,
		value: value || null
	};
};

//Toggle repeat
analytics._repeat = function(additionalInfo, value) {
	return {
		categoty: 'PlaylistControl',
		action: 'Repeat',
		label: additionalInfo || null,
		value: value || null
	};
};

//Mute
analytics._mute = function(additionalInfo, value){
	return {
		categoty: 'VolumeControl',
		action: 'Mute',
		label: additionalInfo || null,
		value: value || null
	};
};

//Volume change
analytics._volume = function(additionalInfo, value){
	return {
		categoty: 'VolumeControl',
		action: 'Change',
		label: additionalInfo || null,
		value: value || null
	};
};

//Fullscreen
analytics._fullscreen = function(additionalInfo, value){
	return {
		categoty: 'ChromeActions',
		action: 'Fullscreen',
		label: additionalInfo || null,
		value: value || null
	};
};

//Minimize
analytics._minimize = function(additionalInfo, value){
	return {
		categoty: 'ChromeActions',
		action: 'Minimize',
		label: additionalInfo || null,
		value: value || null
	};
};

//Close
analytics._close = function(additionalInfo, value){
	return {
		categoty: 'ChromeActions',
		action: 'Close',
		label: additionalInfo || null,
		value: value || null
	};
};

//Maximize
analytics._maximize = function(additionalInfo, value){
	return {
		categoty: 'ChromeActions',
		action: 'Maximize',
		label: additionalInfo || null,
		value: value || null
	};
};

//Restore
analytics._restore = function(additionalInfo, value){
	return {
		categoty: 'ChromeActions',
		action: 'Restore',
		label: additionalInfo || null,
		value: value || null
	};
};

//qrCode usage
analytics._qrCode = function(additionalInfo, value){
	return {
		categoty: 'qrCode',
		action: 'Click',
		label: additionalInfo || null,
		value: value || null
	};
};

//Open files menu
analytics._openFiles = function(additionalInfo, value){
	return {
		categoty: 'Menu',
		action: 'OpenFiles',
		label: additionalInfo || null,
		value: value || null
	};
};

//Open about menu
analytics._openAbout = function(additionalInfo, value){
	return {
		categoty: 'Menu',
		action: 'OpenAbout',
		label: additionalInfo || null,
		value: value || null
	};
};
