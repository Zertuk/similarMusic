var searchInput = "Kanye West";

	var id = '';

	function artistIDLookUp() {	
		$.ajax({
			type: "GET",
			url: "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist&limit=5",
			dataType: "json",
			success: function(data) {
				if (data.artists.items[0].id) {
					id = data.artists.items[0].id;
				}
			}
		});
	};

	function relatedArtistLookUp() {
		$.ajax({
			type: "GET",
			url: "https://api.spotify.com/v1/artists/" + id + "/related-artists",
			dataType: "json",
			success: function(data) {
				console.log(data);
			}
		});
	}

