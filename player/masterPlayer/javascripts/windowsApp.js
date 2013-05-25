masterPlayer.windowsApp = {
	randomMusicFolder: function(){
		//Open random music folder from library
		//=====================================
		var musicLibrary = Windows.Storage.KnownFolders.musicLibrary;
		var folderList = [];
		var musicList = [];

		musicLibrary.getItemsAsync().then(function (items) {

			var verifyFolder = function (items) {
				var newListFolder = [];

				items.forEach(function (item) {
					//Verifica se é do tipo pasta
					if (item.isOfType(Windows.Storage.StorageItemTypes.folder)) {
						//Adiciona no array
						folderList.push(item);
						newListFolder.push(item);
					}
				});

				return newListFolder;
			};

			var getRandomItem = function (folders) {
				//Pega uma pasta randôminca
				var randomNumber = Math.floor((Math.random() * folders.length));
				var selectedFolder = folders[randomNumber];

				return selectedFolder;
			};

			var getFolderFiles = function (folder) {
				//Lê os arquivos dela
				//TODO: Verificar se não houver pastas com músicas, começar a percorrer subpastas
				folder.getFilesAsync().then(function (files) {
					if (files.length == 0) {
						process(items);
						return;
					}
					masterPlayer.fileTreeReader(files);
				});
			};

			var process = function (items) {
				//Inicia processo
				var folderList = verifyFolder(items);
				var folder = getRandomItem(folderList);
				getFolderFiles(folder);
			};

			process(items);

		});
	},
	activated: function(event) {
		if (event.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.file) {
			activatedAction = true;
			masterPlayer.fileTreeReader(event.detail.files);
		} else {
			masterPlayer.windowsApp.randomMusicFolder();
		}
	}
};

masterPlayer.windowsAppInit = function () {
	//Chrome actions
	//==============
	$('#chrome-actions').hide();

	//Folder picker
	//=============
	var folderPicker = new Windows.Storage.Pickers.FolderPicker;
	folderPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.musicLibrary;
	folderPicker.fileTypeFilter.replaceAll([".mp3"]);

	$('.menu-open-files').off().on('click', function (event) {
		folderPicker.pickSingleFolderAsync().then(function (folder) {
			if (folder) {
				var musicList = [];

				folder.getItemsAsync().then(function (items) {
					items.forEach(function (item) {
						//Is a folder ?
						if (item.isOfType(Windows.Storage.StorageItemTypes.folder)) {
							
						} else {
							musicList.push(item);
							//masterPlayer.fileTreeReader(items);
						}
					});

					masterPlayer.fileTreeReader(musicList);
				});
			}
		});
	});	
};