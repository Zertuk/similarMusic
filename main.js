var searchInput = "Kanye West";

function artistIDLookUp() {	
	$.ajax({
		type: "GET",
		url: "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist&limit=5",
		dataType: "json",
		success: function(data) {
			if (data.artists.items[0].id) {
				var id = data.artists.items[0].id;
				console.log(id);
			}
		}
	});
};

