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
                            var pageId = null;
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

                            let url = "https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?format=json&action=parse&prop=sections&page=" + country;
                            let url2 = "https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&&titles=" + country;
                            var WikiUrl = "http://en.wikipedia.com/wiki/" + country;

                            fetch(url)
                                .then(response => {
                                    const contentType = response.headers.get('content-type');
                                    if (!contentType || !contentType.includes('application/json')) {
                                        throw new TypeError("Oops, we haven't got JSON!");
                                    }
                                    return response.json();
                                })
                                .then(data => {
                                    console.log(data.parse.pageid);
                                    pageId = data.parse.pageid;
                                })
                                .catch(error => console.error(error));

                            var obj = {
                                value: '',
                                letMeKnow() {
                                    console.log(`The variable has changed to ${this.description}`);
                                    infowindow.setContent(this.description);
                                },
                                get description() {
                                    return this.value;
                                },
                                set description(value) {
                                    value = truncateString(value, 700);
                                    value = value.concat("<a target='_blank' href=" + WikiUrl + ">Read more</a>");
                                    this.value = value;
                                    this.letMeKnow();
                                }
                            }

                            fetch(url2)
                                .then(response => {
                                    const contentType = response.headers.get('content-type');
                                    if (!contentType || !contentType.includes('application/json')) {
                                        throw new TypeError("Oops, we haven't got JSON!");
                                    }
                                    return response.json();
                                })
                                .then(data => {
                                    obj.description = data.query.pages[pageId].extract;
                                })
                                .catch(error => console.error(error));

                            if (marker && marker.setMap) {
                                marker.setMap(null);
                            }

                            marker = new google.maps.Marker({
                                position: event.latLng,
                                map: map,
                                icon: 'https://img.icons8.com/fluent/48/000000/marker-storm.png',
                                center: event.latLng
                            });
                            infowindow.open(map, marker);
                            console.log("City: " + city + ", City2: " + cityAlt + ", Country: " + country + ", Country Code: " + countryCode);
                        }
                    };
                });

        });
}

function truncateString(str, num) {
    if (str.length > num) {
        return str.slice(0, num) + "...";
    } else {
        return str;
    }
}


