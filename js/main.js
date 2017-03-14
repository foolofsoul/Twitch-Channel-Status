(function(){
	var myClientID = '2qt106tvw8s4lzzfr1nuvfhziihkuf',
			body = document.getElementsByTagName('body')[0],
			btn = document.getElementById('btn'),
			dataSection = document.getElementById('dataSection'),
			modalTimeout,
			channelsArr = [],
			channelNames = [];

	btn.addEventListener('click' || 'keyup', function(event){
		getUserID(event)
			.then(function(id) {
				return getUserStatus(id);
			}, 
			function(error){
				var maxSearchError = createMaxSearchErrorModal(error);
				showErrorModal(maxSearchError);
			})
			.then(function(id){
				return getStreamStatus(id);
			})
			.then(function(index){
				createChannelItem(index);
			});
	});

	function getUserID(event) {
		event.preventDefault();
		return new Promise(function(resolve, reject) {
			if( (event || event.which === 13) && channelsArr.length < 10) {
				var userName = document.getElementById('username').value,
					xhr = new XMLHttpRequest();
				if ( userName === "" ){
					reject("Please enter a Twitch.tv channel name.");
				}
				xhr.onreadystatechange = function(){
					if( this.readyState === 4 && this.status === 200 ){
						var data = JSON.parse(xhr.responseText);
						var userID = data.users[0]._id
						// Pass user id into create user function
						resolve(userID);
					}
				}
				xhr.open('GET', 'https://api.twitch.tv/kraken/users?login='+userName);
				xhr.setRequestHeader('Client-ID', myClientID);
				xhr.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
				xhr.send();
			} else {
				reject("You can only have up to 10 searches.");
			}
		});
	}

	function createMaxSearchErrorModal(errorText){
		var modalDiv = document.createElement('div');
		var modal = document.createElement('div');
		modalDiv.id = 'modal-div';
	  modal.textContent = errorText;
	  modal.id = "modal";
	  modalDiv.appendChild(modal);
	  return modalDiv;
	}

	function showErrorModal(createdError){
	  body.appendChild(createdError);
  	var modalDiv = document.getElementById('modal-div');
  	modalDiv.addEventListener('click', function(e){
  		if( e.target === modalDiv ){
  			body.removeChild(modalDiv);
  			clearTimeout(modalTimeout);
  		}
  	});
  	
  	modalTimeout = setTimeout(function(){
	    body.removeChild(modalDiv);
	  }, 4000);  	
	}

	// Get user status information
	function getUserStatus(id){
		return new Promise(function(resolve, reject) {
			document.getElementById('username').value = "";
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function(){
				if( this.readyState === 4 && this.status === 200 ){
					channelsArr.push({userInfo: JSON.parse(xhr.responseText)});
					resolve(id);
				}
			}
			xhr.open('GET', 'https://api.twitch.tv/kraken/channels/'+id);
			xhr.setRequestHeader('Client-ID', myClientID);
			xhr.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
			xhr.send();
		});
	};


	function getStreamStatus(id){
		return new Promise(function(resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function(){
				if(this.readyState === 4 && this.status === 200 ){
					if (channelsArr.length === 1){
						channelsArr[0].streamInfo = JSON.parse(this.responseText);
						resolve(channelsArr.length - 1);
					} else if (channelsArr.length > 1){
						channelsArr[channelsArr.length - 1].streamInfo = JSON.parse(this.responseText);
						resolve(channelsArr.length - 1);
					}
				}
			}
			xhr.open('GET', 'https://api.twitch.tv/kraken/streams/'+id);
			xhr.setRequestHeader('Client-ID', myClientID);
			xhr.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
			xhr.send();
		});
	}

	function createChannelItem(indexNum){
		var channelItem = document.createElement('a'),
				channelHeader = document.createElement('div'),
				channelTitle = document.createElement('h4'),
				channelLogo = document.createElement('span'),
				channelLogoImg = document.createElement('img'),
				channelOnOffline = document.createElement('span'),
				channelFooter = document.createElement('div'),
				channelInfo = document.createElement('div'),
				channelStatus = document.createElement('h5'),
				channelGame = document.createElement('p'),
				channelGameDiv = document.createElement('div'),
				channelGameImg = document.createElement('img');

		channelItem.setAttribute('href', channelsArr[indexNum].userInfo.url);
		channelItem.className = "channel-item";
		channelHeader.className = "channel-header";
		channelTitle.className = "channel-title";
		channelLogo.className = "channel-logo";

		channelLogoImg.setAttribute('src', channelsArr[indexNum].userInfo.logo || "https://cdn3.iconfinder.com/data/icons/happily-colored-snlogo/512/twitch.png");
		channelLogoImg.setAttribute('alt', channelsArr[indexNum].userInfo.display_name + " Logo");

		channelOnOffline.className = channelsArr[indexNum].streamInfo.stream ? "channel-online" : "channel-offline";
		channelFooter.className = "channel-footer";
		channelInfo.className = "channel-info";
		
		channelStatus.className = "channel-status";
		channelStatus.textContent = channelsArr[indexNum].userInfo.status;

		channelGame.className = "channel-game";
		channelGame.textContent = channelsArr[indexNum].userInfo.game;

		channelGameDiv.className = "channel-game-img";
		channelGameImg.setAttribute("src", "https://static-cdn.jtvnw.net/ttv-boxart/" + encodeURI(channelsArr[indexNum].userInfo.game) + "-100x138.jpg")
		channelGameImg.setAttribute("alt", channelsArr[indexNum].userInfo.game + " Box Art");


		channelLogo.appendChild(channelLogoImg);
		channelTitle.appendChild(channelLogo);
		channelTitle.innerHTML += channelsArr[indexNum].userInfo.display_name;
		channelHeader.appendChild(channelTitle);
		channelHeader.appendChild(channelOnOffline);
		channelInfo.appendChild(channelStatus);
		channelInfo.appendChild(channelGame);
		channelGameDiv.appendChild(channelGameImg);
		channelFooter.appendChild(channelInfo);
		channelFooter.appendChild(channelGameDiv);
		channelItem.appendChild(channelHeader);
		channelItem.appendChild(channelFooter);
		dataSection.appendChild(channelItem);
	}

	

	// var addContainerPromise = new Promise(function(res, err){
	// 	res({message: "Api Call"});
	// });

	// var coolPromise = function (){
	// 	addContainerPromise.then(function(res){
	// 		console.log(res);
	// 		return {message: res};
	// 	}).then(function (res){
	// 		console.log(res);
	// 	})
	// }

	// coolPromise();




}());