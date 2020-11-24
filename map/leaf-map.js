let map;

function initMap() {
    const myLatlng = { lat: 37.990, lng: 23.738 };
    map = new google.maps.Map(document.getElementById("map"),
        {
            zoom: 2,
            center: myLatlng
        });

    var customStyled = [
        {
            featureType: "all",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        }
    ];
    map.set('styles', customStyled);

    const geocoder = new google.maps.Geocoder();
    const infowindow = new google.maps.InfoWindow();
    var marker;

    map.addListener('click',
        (event) => {
            geocoder.geocode({
                    location: event.latLng,
                },
                (results, status) => {
                    if (status === 'OK') {

                        if (results[1]) {
                            var country = null, countryCode = null, city = null, cityAlt = null;
                            var c, lc, component;
                            for (var r = 0, rl = results.length; r < rl; r += 1) {
                                var result = results[r];

                                if (!city && result.types[0] === 'locality') {
                                    for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                                        component = result.address_components[c];

                                        if (component.types[0] === 'locality') {
                                            city = component.long_name;
                                            break;
                                        }
                                    }
                                } else if (!city && !cityAlt && result.types[0] === 'administrative_area_level_1') {
                                    for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                                        component = result.address_components[c];

                                        if (component.types[0] === 'administrative_area_level_1') {
                                            cityAlt = component.long_name;
                                            break;
                                        }
                                    }
                                } else if (!country && result.types[0] === 'country') {
                                    country = result.address_components[0].long_name;
                                    countryCode = result.address_components[0].short_name;
                                }

                                if (city && country) {
                                    break;
                                }
                            }

                            if (marker && marker.setMap) {
                                marker.setMap(null);
                            }

                            marker = new google.maps.Marker({
                                position: event.latLng,
                                map: map,
                                icon: 'https://img.icons8.com/fluent/48/000000/marker-storm.png',
                                center: event.latLng,
                            });
                            infowindow.setContent(country);
                            infowindow.open(map, marker);
                            console.log("City: " + city + ", City2: " + cityAlt + ", Country: " + country + ", Country Code: " + countryCode);
                        }
                    };
                });

        });
}


function wikiCountryName() {

}
//function geocodeLatLng(geocoder, map, infowindow) {
//    const input = document.getElementById("content").value;
//    const latlngStr = myLatlng.split(",", 2);
//    const latlng = {
//        lat: parseFloat(latlngStr[0]),
//        lng: parseFloat(latlngStr[1]),
//    };

//    geocoder.geocode({ 'latlng': latlng },
//        function(results, status) {
//            if (status === google.maps.GeocoderStatus.OK) {

//                var marker = new google.maps.Marker({
//                    map: map,
//                    position: latlng
//                });
//                google.maps.event.addListener(map, 'click', function (event) {
//                    infowindow.setContent("test");// Here you can set your place name
//                    infowindow.open(map);
//                });
//                if (results[1]) {
//                    var country = null, countryCode = null, city = null, cityAlt = null;
//                    var c, lc, component;
//                    for (var r = 0, rl = results.length; r < rl; r += 1) {
//                        var result = results[r];

//                        if (!city && result.types[0] === 'locality') {
//                            for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
//                                component = result.address_components[c];

//                                if (component.types[0] === 'locality') {
//                                    city = component.long_name;
//                                    break;
//                                }
//                            }
//                        } else if (!city && !cityAlt && result.types[0] === 'administrative_area_level_1') {
//                            for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
//                                component = result.address_components[c];

//                                if (component.types[0] === 'administrative_area_level_1') {
//                                    cityAlt = component.long_name;
//                                    break;
//                                }
//                            }
//                        } else if (!country && result.types[0] === 'country') {
//                            country = result.address_components[0].long_name;
//                            countryCode = result.address_components[0].short_name;
//                        }

//                        if (city && country) {
//                            break;
//                        }
//                    }
//                }
//            };
//        });
//}
//google.maps.event.addDomListener(window, 'load', initialize);

