// Under no license, do whatever you want with this.
// Original author: 2011 Daniel Lopes,

(function ($) {

$.fn.geolocate = function (address, options) {

    var defaults = {
      googleMaps: {
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
    };

    var options = $.extend(defaults, options);
    var mapContainer = $(this);
    var geocoder = new google.maps.Geocoder();

    var googleMapsElement = document.getElementById(mapContainer.attr('id'));
    var map = new google.maps.Map(googleMapsElement, options.googleMaps);

		if ($.isArray(address)){
			for (i=0;i<address.length;i++){
				geocoder.geocode({'address': address[i]}, applyLocationToMap);
			}
		}
		else{
    	geocoder.geocode({'address': address}, applyLocationToMap);
		}

    function applyLocationToMap(results, status) {
      var location = results[0].geometry.location;

      if (status == google.maps.GeocoderStatus.OK) {
        google.maps.event.trigger(map, 'resize');
        setMarker(location);
        map.setCenter(location);
      }
    }

    function setMarker(position){
      var maps = new google.maps.Marker({
        map: map,
        position: position
      });
    }

    return this;
};

})(jQuery);