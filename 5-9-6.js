jQuery(document).ready(function() {
	var map = L.map('map');

	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);


	map.locate({setView: true, maxZoom: 18}); //te da la localizacion en la que estas

	L.marker([40.2838, -3.8215]).addTo(map)
	    .bindPopup('AULARIO 3 <br> URJC')
	    .openPopup();

	addr_search = function addr_search() {
	  var inp = document.getElementById("addr");

	  $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + inp.value, function(data) {
		var items = [];

		$.each(data, function(key, val) {
		  items.push(
		    "<li><a href='#' onclick='chooseAddr("+
		    val.lat + ", " + val.lon +  ");return false;'>" + val.display_name +
		    '</a></li>'
		  );
		});

		$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
			{
	          tags: $("#addr").val(),
	          tagmode: "any",
	          format: "json"
        	},	function(data){
	            var imagenes = "";
	            for(i=0;i<5;i++){
	                imagenes += "<img src="+ data.items[i].media.m +">";
	            }
	            $('#photos').html(imagenes);
	            $('#addr').val("");
      	});

		$('#results').empty();
	   	if (items.length != 0) {
		      $('<p>', { html: "Search results:" }).appendTo('#results');
		      $('<ul/>', {
			'class': 'my-new-list',
			html: items.join('')
		      }).appendTo('#results');
		} else {
		      $('<p>', { html: "No results found" }).appendTo('#results');
		}
		//añado el boton de cerrar en el html
		$('<p>', { html: "<button type='button' id='cerrar'>Cerrar</button>" }).appendTo('#results');
		$('#cerrar').click(function(){
			$('#results').empty();
		});
	  });
	}

	chooseAddr = function chooseAddr(lat, lng, type) {
	  var location = new L.LatLng(lat, lng);
	  map.panTo(location);

	  if (type == 'city' || type == 'administrative') {
	    map.setZoom(11);
	  } else {
	    map.setZoom(13);
	  }

	  $('#photos').empty();
	  $('#results').empty();
	}

	function onLocationFound(e) {
	    var radius = e.accuracy / 2;

	    L.marker(e.latlng).addTo(map)
		.bindPopup("You are within " + radius + " meters from this point").openPopup();

	    L.circle(e.latlng, radius).addTo(map);
	}

	map.on('locationfound', onLocationFound);
});
