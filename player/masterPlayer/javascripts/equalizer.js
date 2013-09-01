/// <reference path="_references.js" />
"use strict";


// Fix up for prefixing
window.AudioContext = window.AudioContext||window.webkitAudioContext;

$(function(){
	//Context and connect audio
	var audio 			= document.getElementsByTagName('audio')[0];
	var audioContext 	= new webkitAudioContext();
	var audioElement	= document.getElementsByTagName('audio')[0]
	var audioSource 	= audioContext.createMediaElementSource( audioElement );
	var qFactor 		= -20;	//1 <> 100
	var filters 		= {};
	
	//Filters
	//-----------------------

	//32Hz
	filters['1'] 					= audioContext.createBiquadFilter();
	filters['1'].frequency.value 	= 32;
	filters['1'].type 				= 3;		
	filters['1'].gain.value 		= 0;
	filters['1'].Q.value 			= qFactor;

	//64Hz
	filters['2']				=	 audioContext.createBiquadFilter();
	filters['2'].frequency.value 	= 64;
	filters['2'].type 				= 3;
	filters['2'].gain.value 		= 0;
	filters['2'].Q.value 			= qFactor;

	//125Hz
	filters['3']  					= audioContext.createBiquadFilter();
	filters['3'].frequency.value 	= 125;
	filters['3'].type 				= 3;
	filters['3'].gain.value 		= 0;
	filters['3'].Q.value 			= qFactor;

	//250Hz
	filters['4']  					= audioContext.createBiquadFilter();
	filters['4'].frequency.value 	= 250;
	filters['4'].type 				= 5;
	filters['4'].gain.value 		= 0;
	filters['4'].Q.value 			= qFactor;

	//500Hz
	filters['5']  					= audioContext.createBiquadFilter();
	filters['5'].frequency.value 	= 500;
	filters['5'].type 				= 5;
	filters['5'].gain.value 		= 0;
	filters['5'].Q.value 			= qFactor;

	//1KHz
	filters['6']  					= audioContext.createBiquadFilter();
	filters['6'].frequency.value 	= 1000;
	filters['6'].type 				= 5;
	filters['6'].gain.value 		= 0;
	filters['6'].Q.value 			= qFactor;

	//2KHz
	filters['7']  					= audioContext.createBiquadFilter();
	filters['7'].frequency.value 	= 2000;
	filters['7'].type 				= 5;
	filters['7'].gain.value 		= 0;
	filters['7'].Q.value 			= qFactor;

	//4KHz
	filters['8']  					= audioContext.createBiquadFilter();
	filters['8'].frequency.value 	= 4000;
	filters['8'].type 				= 4;
	filters['8'].gain.value 		= 0;
	filters['8'].Q.value 			= qFactor;

	//8KHz
	filters['9']  					= audioContext.createBiquadFilter();
	filters['9'].frequency.value 	= 8000;
	filters['9'].type 				= 4;
	filters['9'].gain.value 		= 0;
	filters['9'].Q.value 			= qFactor;

	//16KHz
	filters['10']  					= audioContext.createBiquadFilter();
	filters['10'].frequency.value 	= 16000;
	filters['10'].type 				= 4;
	filters['10'].gain.value 		= 0;
	filters['10'].Q.value 			= qFactor;

	//Connect destination
	filters['1'].connect(filters['2']);
	filters['2'].connect(filters['3']);
	filters['3'].connect(filters['4']);
	filters['4'].connect(filters['5']);
	filters['5'].connect(filters['6']);
	filters['6'].connect(filters['7']);
	filters['7'].connect(filters['8']);
	filters['8'].connect(filters['9']);
	filters['9'].connect(filters['10']);
	

	audioSource.connect(audioContext.destination);
	audioSource.connect(filters['1']);
	filters['10'].connect(audioContext.destination);

	//Local storage
	//-----------------------
	if(!savedUserInfo.get('equalizer.filters')) {
		savedUserInfo.set('equalizer.filters', {
				1: 0,
				2: 0,
				3: 0,
				4: 0,
				5: 0,
				6: 0,
				7: 0,
				8: 0,
				9: 0,
				10: 0
			}
		);
	}

	
	//HTML Sliders
	//-----------------------
	var sliderDefaultOptions = {
		orientation: 'vertical',
		range: 'min',
		min: -12,
		max: 12,
		animate: true,
		step: 0.01
	};

	var savedFilters = savedUserInfo.get('equalizer.filters');

	$.each(filters, function(i, filter){
		$('.eq-fq-slider', '.equalizer-sliders').eq(i - 1).slider($.extend({
			slide: function(event, ui) {	
				filters[i.toString()].gain.value = ui.value;
				
				savedFilters[i.toString()] = ui.value;
				savedUserInfo.set('equalizer.filters', savedFilters);
			},
			change: function(event, ui){
				filters[i.toString()].gain.value = ui.value;

				savedFilters[i.toString()] = ui.value;
				savedUserInfo.set('equalizer.filters', savedFilters);
			}
		},sliderDefaultOptions));

		if( savedFilters[i.toString()] != 0 ) {
			$('.eq-fq-slider', '.equalizer-sliders').eq(i - 1).slider('value', savedFilters[i.toString()]);
		}
	});

	//Reset FILTERS
	$('.equalizer-reset', '#equalizer').on('click', function(event) {
		$('.eq-fq-slider', '.equalizer-sliders').slider('value', '0');
		event.preventDefault();
	});
	
});