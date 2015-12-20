(function(){var a=angular.module("mapModule",[]);a.service("mapService",["$q",function(b){var e=this;this.map={};this.geocoder={};this.directionsService={};this.directionsDisplay={};this.markers=[];function d(m){var h=new MapResult();var k=m[0];for(var l=0;l<m.length;++l){if(m[l].geometry.location_type==="APPROXIMATE"){k=m[l];break}}h.formatted_address=k.formatted_address;for(var l=0;l<k.address_components.length;++l){var j=k.address_components[l];switch(j.types[0]){case"country":h.country=j.short_name||"";break;case"postal_code":h.postal_code=j.short_name||"";break;case"administrative_area_level_1":h.administrative_area_level_1=j.short_name||"";break;case"administrative_area_level_2":h.administrative_area_level_2=j.short_name||"";break;case"administrative_area_level_3":h.administrative_area_level_3=j.short_name||"";break;case"administrative_area_level_4":h.administrative_area_level_4=j.short_name||"";break;case"administrative_area_level_5":h.administrative_area_level_5=j.short_name||"";break;case"locality":h.locality=j.short_name||"";break;case"sublocality_level_1":h.sublocality_level_1=j.short_name||"";break;case"sublocality_level_2":h.sublocality_level_2=j.short_name||"";break;case"sublocality_level_3":h.sublocality_level_3=j.short_name||"";break;case"sublocality_level_4":h.sublocality_level_4=j.short_name||"";break;case"sublocality_level_5":h.sublocality_level_5=j.short_name||"";break;case"neighborhood":h.neighborhood=j.short_name||"";break;case"premise":h.premise=j.short_name||"";break;case"subpremise":h.subpremise=j.short_name||"";break}}h.lat=k.geometry.location.lat();h.lng=k.geometry.location.lng();console.log(h);return h}function c(i){var h=b.defer();e.geocoder.geocode({location:i},function(l,k){if(k===google.maps.GeocoderStatus.OK){var j=d(l);if(j){h.resolve(j)}else{h.reject("No reverse geocoding results found")}}else{h.reject("Reverse geocoder failed due to: "+k)}});return h.promise}function f(h){var i=b.defer();e.geocoder.geocode({address:h},function(l,k){if(k===google.maps.GeocoderStatus.OK){var j=d(l);if(j){i.resolve(j)}else{i.reject("No geocoding results found")}}else{i.reject("Geocoder failed due to: "+k)}});return i.promise}function g(){if(e.markers.Home&&e.markers.Office){console.log("drawing route from home to office");var h={origin:e.markers.Home.getPosition(),destination:e.markers.Office.getPosition(),travelMode:google.maps.TravelMode.DRIVING};e.directionsService.route(h,function(i,j){if(j==google.maps.DirectionsStatus.OK){e.directionsDisplay.setDirections(i)}})}}this.searchAddress=function(h,j,k){var i=b.defer();f(h).then(function(l){var n={lat:l.lat,lng:l.lng};console.log(n);e.map.setCenter(n);var m={};if(e.markers[j]){m=e.markers[j];m.setPosition(n)}else{m=new google.maps.Marker({position:n,map:e.map,title:j,draggable:true,animation:google.maps.Animation.DROP,label:j});google.maps.event.addListener(m,"dragend",function(o){console.log(o.latLng);c(o.latLng).then(function(p){g();k({status:true,result:p})},function(p){k({status:false})})});e.markers[j]=m}m.setMap(e.map);g();i.resolve(l)},function(l){i.reject("Failed to search address")});return i.promise};this.getCurrentLocation=function(i,j){var h=b.defer();if(navigator.geolocation){navigator.geolocation.getCurrentPosition(function(k){latLng=new google.maps.LatLng(k.coords.latitude,k.coords.longitude);c(latLng).then(function(l){var n=l.formatted_address;console.log(n);e.map.setCenter(latLng);h.resolve(l);var m={};if(e.markers[i]){m=e.markers[i];m.setPosition(latLng)}else{m=new google.maps.Marker({position:latLng,map:e.map,title:i,draggable:true,animation:google.maps.Animation.DROP,label:i});google.maps.event.addListener(m,"dragend",function(o){console.log(o.latLng);c(o.latLng).then(function(p){g();j({status:true,result:p})},function(p){j({status:false})})});e.markers[i]=m}m.setMap(e.map);g()},function(l){console.log(l);h.reject(l)})},function(){h.reject("Failed to get current location")})}else{h.reject("Browser doesn't support fetching the current location")}return h.promise};(function(){e.map=new google.maps.Map(document.getElementById("map-canvas"),{center:new google.maps.LatLng(28.61,77.23),zoom:12});e.geocoder=new google.maps.Geocoder;e.directionsService=new google.maps.DirectionsService();e.directionsDisplay=new google.maps.DirectionsRenderer({markerOptions:{visible:false}});e.directionsDisplay.setMap(e.map)})()}])})();