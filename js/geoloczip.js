var pos = null;
var zipcode;
function findloc() {
  console.log("Inside findloc");
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
      zipcode = address[address.length - 1].long_name;
      document.getElementById("zipcode").value = zipcode;
      alert(zipcode);
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
