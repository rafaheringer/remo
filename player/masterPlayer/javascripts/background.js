"use strict";

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('masterPlayer/index.html', {
  	id: 'masterPlayer',
    width: 900,
    height: 500,
    minWidth: 900,
    minHeight: 500,
    frame: 'none'
  });
});