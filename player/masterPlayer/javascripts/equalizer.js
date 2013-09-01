/// <reference path="_references.js" />
"use strict";


// Fix up for prefixing
window.AudioContext = window.AudioContext||window.webkitAudioContext;

$(function(){
	//Context and connect audio
	var audio			= document.getElementsByTagName('audio')[0];
	var audioContext	= new webkitAudioContext();
	var audioElement	= document.getElementsByTagName('audio')[0]
	var audioSource		= audioContext.createMediaElementSource( audioElement );
	var qFactor			= 1;	//1 <> 100
	var frequencies		= {};
	
	//Frequencies
	//-----------------------

	//32Hz
	frequencies['1']					= audioContext.createBiquadFilter();
	frequencies['1'].frequency.value	= 32;
	frequencies['1'].type				= 3;		
	frequencies['1'].gain.value			= 0;
	frequencies['1'].Q.value			= qFactor;

	//64Hz
	frequencies['2']					= audioContext.createBiquadFilter();
	frequencies['2'].frequency.value	= 64;
	frequencies['2'].type				= 3;
	frequencies['2'].gain.value			= 0;
	frequencies['2'].Q.value			= qFactor;

	//125Hz
	frequencies['3']					= audioContext.createBiquadFilter();
	frequencies['3'].frequency.value	= 125;
	frequencies['3'].type				= 3;
	frequencies['3'].gain.value			= 0;
	frequencies['3'].Q.value			= qFactor;

	//250Hz
	frequencies['4']					= audioContext.createBiquadFilter();
	frequencies['4'].frequency.value	= 250;
	frequencies['4'].type				= 5;
	frequencies['4'].gain.value			= 0;
	frequencies['4'].Q.value			= qFactor;

	//500Hz
	frequencies['5']					= audioContext.createBiquadFilter();
	frequencies['5'].frequency.value	= 500;
	frequencies['5'].type				= 5;
	frequencies['5'].gain.value			= 0;
	frequencies['5'].Q.value			= qFactor;

	//1KHz
	frequencies['6']					= audioContext.createBiquadFilter();
	frequencies['6'].frequency.value	= 1000;
	frequencies['6'].type				= 5;
	frequencies['6'].gain.value			= 0;
	frequencies['6'].Q.value			= qFactor;

	//2KHz
	frequencies['7']					= audioContext.createBiquadFilter();
	frequencies['7'].frequency.value	= 2000;
	frequencies['7'].type				= 5;
	frequencies['7'].gain.value			= 0;
	frequencies['7'].Q.value			= qFactor;

	//4KHz
	frequencies['8']					= audioContext.createBiquadFilter();
	frequencies['8'].frequency.value	= 4000;
	frequencies['8'].type				= 4;
	frequencies['8'].gain.value			= 0;
	frequencies['8'].Q.value			= qFactor;

	//8KHz
	frequencies['9']					= audioContext.createBiquadFilter();
	frequencies['9'].frequency.value	= 8000;
	frequencies['9'].type				= 4;
	frequencies['9'].gain.value			= 0;
	frequencies['9'].Q.value			= qFactor;

	//16KHz
	frequencies['10']					= audioContext.createBiquadFilter();
	frequencies['10'].frequency.value	= 16000;
	frequencies['10'].type				= 4;
	frequencies['10'].gain.value		= 0;
	frequencies['10'].Q.value			= qFactor;

	//Connect destination
	audioSource.connect(frequencies['1']);
	frequencies['1'].connect(frequencies['2']);
	frequencies['2'].connect(frequencies['3']);
	frequencies['3'].connect(frequencies['4']);
	frequencies['4'].connect(frequencies['5']);
	frequencies['5'].connect(frequencies['6']);
	frequencies['6'].connect(frequencies['7']);
	frequencies['7'].connect(frequencies['8']);
	frequencies['8'].connect(frequencies['9']);
	frequencies['9'].connect(frequencies['10']);
	frequencies['10'].connect(audioContext.destination);

	//Local storage
	//-----------------------
	if(!savedUserInfo.get('equalizer.frequencies')) {
		savedUserInfo.set('equalizer.frequencies', {
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
		step: 0.1
	};

	var savedFrequencies = savedUserInfo.get('equalizer.frequencies');

	$.each(frequencies, function(i, filter){
		$('.eq-fq-slider', '.equalizer-sliders').eq(i - 1).slider($.extend({
			slide: function(event, ui) {	
				frequencies[i.toString()].gain.value = ui.value;
			},
			change: function(event, ui){
				frequencies[i.toString()].gain.value = ui.value;

				//Save
				savedFrequencies[i.toString()] = ui.value;
				savedUserInfo.set('equalizer.frequencies', savedFrequencies);
			}
		},sliderDefaultOptions));

		if( savedFrequencies[i.toString()] != 0 ) {
			$('.eq-fq-slider', '.equalizer-sliders').eq(i - 1).slider('value', savedFrequencies[i.toString()]);
		}
	});

	//Reset frequencies
	$('.equalizer-reset', '#equalizer').on('click', function(event) {
		$('.eq-fq-slider', '.equalizer-sliders').slider('value', '0');
		event.preventDefault();
	});
	
});