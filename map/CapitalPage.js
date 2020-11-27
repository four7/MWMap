var weatherCapitals;
//const target = document.getElementById('capitalForcasts');

function capitalCity() {
    const capitalDiv = document.getElementById('capitalDiv');
    const capitalContentInfo = document.getElementById('capitalContentInfo');
    var cityCapital = localStorage.getItem("capitalName");

    console.log(cityCapital);
    let capitalUrl = "https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?format=json&action=parse&prop=sections&page=" + cityCapital;
    let capitalUrl2 = "https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&&titles=" + cityCapital;
    var pageId = null;

    fetch(capitalUrl)
        .then(response => {
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new TypeError("Oops, we haven't got JSON!");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            pageId = data.parse.pageid;
        })
        .catch(error => console.error(error));

    var obj = {
        value: '',
        letMeKnow2() {
            console.log(`The variable has changed to ${this.description}`);
        },
        get description() {
            return this.value;
        },
        set description(value) {
            console.log(value);
            localStorage.setItem("capitalContent", value);
            value = truncateStrings(value, 700);
            this.value = value;

            console.log(value);
            this.letMeKnow2();
        }
    }

    fetch(capitalUrl2)
        .then(response => {
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new TypeError("Oops, we haven't got JSON!");
            }
            return response.json();
        })
        .then(data => {
            obj.description = data.query.pages[pageId].extract;
            console.log(pageId);
        })
        .catch(error => console.error(error));

    var capitalContent = localStorage.getItem("capitalContent");

    var capitalPic = "https://cors-anywhere.herokuapp.com/http://en.wikipedia.org/w/api.php?action=query&titles=" + cityCapital + "&prop=pageimages&format=json&pithumbsize=400";

    fetch(capitalPic)
        .then(response => {
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new TypeError("Oops, we haven't got JSON!");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            var picThumb = data.query.pages[pageId].thumbnail.source;
            console.log(picThumb);
            localStorage.setItem("picThumbnail", picThumb);
        })
        .catch(error => console.error(error));

    var testPic = localStorage.getItem("picThumbnail");
    console.log(testPic);

    getCapitalForecast();
    var capitalF = localStorage.getItem("weatherCapital");
    var testKort = localStorage.getItem("testCards");

    const htmlCapital = (`
                        <div class='paddington'>
                            <div class='container countryBg'>
                                <h3><b>${cityCapital}</b></h3>
                                    <div class='flags'>
                                        <img src='${testPic}' alt="Country Flag" />
                                    </div>
                                    <br/>
                                    <p>${capitalContent}</p>
                            </div>
                        </div>
                    `);

    //var capitalF = localStorage.getItem("weatherCapital");
    capitalDiv.insertAdjacentHTML('afterbegin', htmlCapital);
    //capitalContentInfo.insertAdjacentHTML('afterbegin', htmlContent);
    //target2.insertAdjacentHTML('afterbegin', capitalF);
};

$(document).ready(capitalCity);

function truncateStrings(str, num) {
    if (str.length > num) {
        return str.slice(0, num) + "...";
    } else {
        return str;
    }
}

function getCapitalForecast() {
    const CLIENT_ID = "amwm4D5Qu8eYpCnMbDyQZ";
    const CLIENT_SECRET = "txBqhl3kfvc55xgSU9NDJ52YTjyPMMwDvDqpCW6u";
    const aeris = new AerisWeather(CLIENT_ID, CLIENT_SECRET);
    const target = document.getElementById('capitalForecasts');
    var capitalCity = localStorage.getItem("capitalName");
    var capitalCountryCode = localStorage.getItem("countryStorage");
    var countryCode = capitalCountryCode;

    window.clearInterval('click');

    const request = aeris.api().endpoint('forecasts').place(capitalCity + "," + countryCode).limit(5);
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

                const capitalHtml = (`
                            <div class="capitalCard">
                                <div class="capitalCard-body">
                                    <p class="title">${aeris.utils.dates.format(date, 'h:mm, M/d/yyyy')}</p>
                                    <p><img class="icon" src="${icon}"></p>
                                    <p class="wx">${weather}</p>
                                    <p class="temps"><span>High:</span>${maxTempC}C° <span>Low:</span>${minTempC}C°</p>
                                </div>
                            </div>
                    `);

                localStorage.setItem("weatherCapitals", capitalHtml);
                console.log(data);

                target.insertAdjacentHTML('afterbegin', capitalHtml);
            });
        }
    });
}
$(document).ready(getCapitalForecast);
