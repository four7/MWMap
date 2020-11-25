function getWeather() {
    const CLIENT_ID = "amwm4D5Qu8eYpCnMbDyQZ";
    const CLIENT_SECRET = "txBqhl3kfvc55xgSU9NDJ52YTjyPMMwDvDqpCW6u";
    const target = document.getElementById('forecast');
    const aeris = new AerisWeather(CLIENT_ID, CLIENT_SECRET);
    var mapCity = localStorage.getItem("cityStorage");
    var mapCountryCode = localStorage.getItem("countryStorage");
    var city = mapCity;
    var countryCode = mapCountryCode;
    console.log(city);
    console.log(countryCode);

    window.clearInterval('click');

    const request = aeris.api().endpoint('forecasts').place(city + "," + countryCode).limit(1);
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

                const html = (`
                        <div class="card">
                            <div class="card-content">
                                <p><b>${city}</b></p>
                                <p class="title">${aeris.utils.dates.format(date, 'h:mm, M/d/yyyy')}</p>
                                <p><img class="icon" src="${icon}"></p>
                                <p class="wx">${weather}</p>
                                <p class="temps"><span>High:</span>${maxTempC}C° <span>Low:</span>${minTempC}C°</p>
                            </div>
                        </div>
                    `);

                //if (html) {
                //    var element = document.getElementById('forecast');
                //    element.remove();
                //}
                //var newItem = html;
                target.insertAdjacentHTML('afterbegin', html);
                localStorage.setItem("weatherStorage", html);
                //target.parentNode.replaceChild(newItem, target);
            });
        }
    });
}