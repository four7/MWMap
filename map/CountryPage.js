var testCapital;
var weatherTest;

$(document).ready(function () {
    const wikiDiv = document.getElementById('wiki');
    var wikiContent = localStorage.getItem("wikiContent");
    var mapCity = localStorage.getItem("cityStorage");
    var country = localStorage.getItem("wikiCountry");
    var pageId = localStorage.getItem("idStorage");

    var picUrl = "https://cors-anywhere.herokuapp.com/http://en.wikipedia.org/w/api.php?action=query&titles=" + country + "&prop=pageimages&format=json&pithumbsize=400";

        fetch(picUrl)
            .then(response => {
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new TypeError("Oops, we haven't got JSON!");
                }
                return response.json();
            })
            .then(data => {
                var flagThumb = data.query.pages[pageId].thumbnail.source;
                localStorage.setItem("flagThumbnail", flagThumb);
            })
            .catch(error => console.error(error));

    var testFlag = localStorage.getItem("flagThumbnail");

    makeSPARQLQuery(endpointUrl, sparqlQuery, function (data) {
        $('body').append($('<pre>').text(JSON.stringify(data)));
        localStorage.setItem("capitalName", data.results.bindings[0].entLabel.value);
        testCapital = localStorage.getItem("capitalName");
    });

    var capitalNames = localStorage.getItem("capitalName");

    getCapitalWeather();
    var capitalW = localStorage.getItem("weatherCapital");

    const htmlWiki = (`
                        <div class='paddington'>
                            <div class='container countryBg'>
                                <div class='flags'>
                                    <img src='${testFlag}' alt="Country Flag" />
                                </div>
                                <div id='capitalWeather'>${capitalW}</div>
                                <a href="/capital-page/" class="btn btn-small btn-info"><i class="icon-info-sign"></i>Click here for capital city info</a>
                                <p>${wikiContent}</p>
                            </div>
                        </div>
                    `);

    wikiDiv.insertAdjacentHTML('afterbegin', htmlWiki);
});

function makeSPARQLQuery(endpointUrl, sparqlQuery, doneCallback) {
    var settings = {
        headers: { Accept: 'application/sparql-results+json' },
        data: { query: sparqlQuery }
    };
    return $.ajax(endpointUrl, settings).then(doneCallback);
}

var country2 = localStorage.getItem("wikiCountry");

var endpointUrl = 'https://query.wikidata.org/sparql',
    sparqlQuery = "SELECT ?capital ?entLabel WHERE {\n" +
        "  SERVICE wikibase:mwapi {\n" +
        "      bd:serviceParam mwapi:search \" "+ country2 +"\" .    \n" +
        "      bd:serviceParam mwapi:language \"en\" .    \n" +
        "      bd:serviceParam wikibase:api \"EntitySearch\" .\n" +
        "      bd:serviceParam wikibase:endpoint \"www.wikidata.org\" .\n" +
        "      bd:serviceParam wikibase:limit 1 .\n" +
        "      ?item wikibase:apiOutputItem mwapi:item .\n" +
        "  }\n" +
        "  ?item wdt:P36 ?capital\n" +
        "OPTIONAL {\n" +
        "    ?capital rdfs:label ?entLabel filter (lang(?entLabel) = \'en\').\n" +
        "  }     \n" +
        "} ORDER BY DESC(?obj)LIMIT 5 ";


function getCapitalWeather() {
    const CLIENT_ID = "amwm4D5Qu8eYpCnMbDyQZ";
    const CLIENT_SECRET = "txBqhl3kfvc55xgSU9NDJ52YTjyPMMwDvDqpCW6u";
    const target = document.getElementById('capitalWeather');
    const aeris = new AerisWeather(CLIENT_ID, CLIENT_SECRET);

    var testCapital2 = localStorage.getItem("capitalName");
    var mapCountryCode = localStorage.getItem("countryStorage");
    var countryCode = mapCountryCode;

    window.clearInterval('click');

    const request = aeris.api().endpoint('forecasts').place(testCapital2 + "," + countryCode).limit(1);
    request.get().then((result) => {
        const data = result.data;
        const { periods } = data[0];
        if (periods) {
            periods.reverse().forEach(period => {
                const date = new Date(period.dateTimeISO);
                const icon = `https://cdn.aerisapi.com/wxblox/icons/${period.icon || 'na.png'}`;
                const maxTempC = period.maxTempC || 'N/A';
                const minTempC = period.minTempC || 'N/A';
                const weather = period.weatherPrimary || 'N/A';

                const html2 = (`
                            <div class="countryBg paddTop">
                                <div class="paddTop" style="background-color: #f2f3f8;">
                                    <p><a href="/capital-page/"><b>${testCapital2}</b></a></p>
                                    <p class="title">${aeris.utils.dates.format(date, 'h:mm, M/d/yyyy')}</p>
                                    <p><img class="icon" src="${icon}"></p>
                                    <p class="wx">${weather}</p>
                                    <p class="temps"><span>High:</span>${maxTempC}C° <span>Low:</span>${minTempC}C°</p>
                                </div>
                            </div>
                    `);

                localStorage.setItem("weatherCapital", html2);
                weatherTest = html2;
                capitalCity();
            });
        }
    });
}