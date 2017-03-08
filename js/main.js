(function(){
	var myClientID = '2qt106tvw8s4lzzfr1nuvfhziihkuf',
			btn = document.getElementById('btn'),
			dataSection = document.getElementById('dataSection'),
			channelsArr = [];

	btn.addEventListener('click', function(){
		getUserID().then(function(id) {
			return getUserStatus(id);
		}).then(function(id){
			getStreamStatus(id);
		}).then(function(){
			// Make "channel-item"
			/*
				Make array that holds channel-name. Then create a function
				that iterates over each name and updates it if name already
				exists, in order to not have duplicates. If name does not exist
				add channel-item
			*/
		})
	});

	function getUserID() {
		return new Promise(function(resolve, reject) {
			event.preventDefault();
			var userName = document.getElementById('username').value,
				xhr = new XMLHttpRequest();
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
		});
	}


	// Get user status information
	function getUserStatus(id){
		return new Promise(function(resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function(){
				if( this.readyState === 4 && this.status === 200 ){
					channelsArr.push({userInfo: JSON.parse(xhr.responseText)})
					dataSection.innerHTML += xhr.responseText;
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
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if(this.readyState === 4 && this.status === 200 ){
				if (channelsArr.length === 1){
					channelsArr[0].streamInfo = JSON.parse(xhr.responseText);
					console.log(channelsArr[0].userInfo.display_name);
					dataSection.innerHTML += "<br>" + xhr.responseText + "<br>";
				} else if (channelsArr.length > 1){
					channelsArr[channelsArr.length - 1].streamInfo = JSON.parse(xhr.responseText);
					// console.log(channelsArr);
					dataSection.innerHTML += "<br>" + xhr.responseText + "<br>";
				}
			}
		}
		xhr.open('GET', 'https://api.twitch.tv/kraken/streams/'+id);
		xhr.setRequestHeader('Client-ID', myClientID);
		xhr.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
		xhr.send();
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