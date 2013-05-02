//FileTree reader
masterPlayer.fileTreeReader = function(files){
	var playList = [],
		musicsReady = 0,
		totalMusics = files.length;
	
	//Filesystem for trees
	function traverseItemTree(item, path) {
		path = path || "";
		if (item.isFile) {
			// Get file
			item.file(function(file) {
				traverseFileTree(file, item);
			});
		} else if (item.isDirectory) {
			// Get folder contents
			var dirReader = item.createReader();
			dirReader.readEntries(function(entries) {
				for (var i=0; i<entries.length; i++) {
					traverseItemTree(entries[i], path + item.name + "/");
				}
			});
		}
	}

	//Filesystem for upload trees
	function traverseFileTree(file, item) {
		if(file.type === 'audio/mp3') {

			var reader = new FileReader();
			reader.readAsArrayBuffer(file);


			reader.onload = function(e) {
				var dv = new jDataView(this.result);
				var ID3 = {};

				// "TAG" starts at byte -128 from EOF.
				// See http://en.wikipedia.org/wiki/ID3
				if (dv.getString(3, dv.byteLength - 128) == 'TAG') {
					ID3 = {
						title: dv.getString(30, dv.tell()),
						artist: dv.getString(30, dv.tell()),
						album: dv.getString(30, dv.tell()),
						year: dv.getString(4, dv.tell())
					};

					playList.push({
						title: ID3.title,
						artist: ID3.artist,
						album: ID3.album,
						year: ID3.year,
						mp3: window.URL.createObjectURL(file)
					});

				}

				//If wont find ID3
				else {
					var fileName = file.name.replace(".mp3","");
					var title = fileName;
					var artist = null;
					
					if(fileName.split(' - ').length >= 2) {
						title = fileName.split(' - ')[0];
						artist = fileName.split(' - ')[1];
					}

					playList.push({
						title: title,
						artist: artist,
						mp3: window.URL.createObjectURL(file)
					});
				}

				//Is ready?
				musicsReady++;

				if(totalMusics == musicsReady) {
					//Play the playlist
					if(playList.length) {
						masterPlayer.config.playlistInstance.setPlaylist(playList);
						masterPlayer.config.playlistInstance.play();
					}
				}
			};
		}
	}


	//Detect
	for (var i=0; i < totalMusics; i++) {
		if(typeof files[i].webkitGetAsEntry == 'function') {
			var item = files[i].webkitGetAsEntry();
			if (item) {
				traverseItemTree(item);
			}
		} else {
			traverseFileTree(files[i]);
		}
	}
};