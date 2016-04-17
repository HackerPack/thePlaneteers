var pos = null
function findloc() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log(pos);
      var geocoder = new google.maps.Geocoder;
      geocoder.geocode({'location': pos}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      var address = results[0].address_components;
      var zipcode = address[address.length - 1].long_name;
      alert(zipcode);
      if (results[1]) {
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
    }, function() {
      alert("Geolocation does not have permission");
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}
