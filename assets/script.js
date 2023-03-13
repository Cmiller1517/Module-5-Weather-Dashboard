var savedSearches = [];
// ------------------------SEARCH BAR FUNCTIONS------------------//
// called when the search form is submitted
$("#city-search").on("submit", function () {
  event.preventDefault();

  // get name of city searched
  var cityName = $(".city-input").val();

  if (cityName === "" || cityName == null) {
    //send alert if search input is empty when submitted
    alert("Please enter name of city.");
    event.preventDefault();
  } else {
    // if cityName is valid, add it to search history list and display its weather conditions
    currentWeatherSection(cityName);
    fiveDayForecastSection(cityName);
  }
});


// make list of previously searched cities
var searchHistory = function (cityName) {
  $('.past-search:contains("' + cityName + '")').remove();

  // creates a new entry with city name selected
  var searchHistoryEntry = $("<p>");
  searchHistoryEntry.addClass("past-search");
  searchHistoryEntry.text(cityName);

  // creates the styling container
  var searchEntryContainer = $("<div>");
  searchEntryContainer.addClass("past-search-container");

  // append entry to container
  searchEntryContainer.append(searchHistoryEntry);

  // append entry container to search history container
  var searchHistoryContainerEl = $("#search-history");
  searchHistoryContainerEl.append(searchEntryContainer);

  if (savedSearches.length > 0) {
    // update savedSearches array with previously saved searches
    var previousSavedSearches = localStorage.getItem("savedSearches");
    savedSearches = JSON.parse(previousSavedSearches);
  }

  // add city name to array of saved searches
  savedSearches.push(cityName);
  localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

  // reset search input
  $("#search-input").val("");

};

// load saved search history entries into search history container
var loadSearchHistory = function () {
  // get saved search history
  var savedSearchHistory = localStorage.getItem("savedSearches");

  // return false if there is no previous saved searches
  if (!savedSearchHistory) {
    return false;
  }

  // turn saved search history string into array
  savedSearchHistory = JSON.parse(savedSearchHistory);

  // go through savedSearchHistory array and make entry for each item in the list
  for (var i = 0; i < savedSearchHistory.length; i++) {
    searchHistory(savedSearchHistory[i]);
  }
};

// -----------------------CITY HISTORY FUNCTIONS---------------//
// called when a search history entry is clicked
$("#search-history").on("click", "p", function () {
  // get text (city name) of entry and pass it as a parameter to display weather conditions
  var previousCityName = $(this).text();
  currentWeatherSection(previousCityName);
  fiveDayForecastSection(previousCityName);

  //
  var previousCityClicked = $(this);
  previousCityClicked.remove();
});

loadSearchHistory();

// -------------- WEATHER API SECTION--------------------//ar today = dayjs();
var cityName;
var cityId;
var clicked = false;
var searchHistory = [];
var searchList = document.querySelector("#search-list");
var currentCity = document.querySelector("#current-city");

// Upon button click, retrieves OpenWeather API for current and 5 day forecasts, as well as push user city entries into localStorage.
$("#search-btn").click(function (event) {
  event.preventDefault();
  var cityName = $(this).siblings(".city-input").val();
  document.querySelector("#old-search").value = "";
  getApi();

  function getApi() {
    var requestFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=03e2b0141cd0f7d9d15a27103279bb3e&units=metric";
    var requestToday = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=03e2b0141cd0f7d9d15a27103279bb3e&units=metric";

    fetch(requestFiveDay)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {


        var cityId = JSON.stringify(data.city.id);
        var citySearch = {
          idOfCity: cityId,
          nameOfCity: cityName
        }

        searchHistory.push(citySearch);
        localStorage.setItem("search", JSON.stringify(searchHistory));


        if (!clicked == true) {
          renderSearchHistory();
        }

        currentCity.textContent = citySearch.nameOfCity;

        for (i = 1; i < 6; i++) {
          var dayOfWeek = dayjs().add(i, 'day').format('MM/DD/YYYY');
          var weekdays = document.querySelector(".card-day" + (i - 1));
          var icon = document.querySelector(".card-img" + (i - 1));
          var weekdaysTemp = document.querySelector(".card-temp" + (i - 1));
          var weekdaysWind = document.querySelector(".card-wind" + (i - 1));
          var weekdaysHum = document.querySelector(".card-hum" + (i - 1));
          weekdays.textContent = dayOfWeek;
          weekdaysTemp.textContent = "Temperature: " + (((data.list[(i - 1) * 8].main.temp) * 9 / 5) + 32).toFixed(2) + " °F";
          weekdaysWind.textContent = "Wind Speed: " + data.list[(i - 1) * 8].wind.speed + " MPH";
          weekdaysHum.textContent = "Humidity: " + data.list[(i - 1) * 8].main.humidity + "%";

          if (data.list[(i - 1) * 8].weather[0].main === "Clear") {
            icon.src = "https://openweathermap.org/img/wn/01d@2x.png"

          }
          if (data.list[(i - 1) * 8].weather[0].main === "Clouds") {
            icon.src = "https://openweathermap.org/img/wn/02d@2x.png"

          }
          if (data.list[(i - 1) * 8].weather[0].main === "Rain") {
            icon.src = "https://openweathermap.org/img/wn/10d@2x.png"

          }
          if (data.list[(i - 1) * 8].weather[0].main === "Thunderstorm") {
            icon.src = "https://openweathermap.org/img/wn/11d@2x.png"

          }
          if (data.list[(i - 1) * 8].weather[0].main === "Snow") {
            icon.src = "https://openweathermap.org/img/wn/13d@2x.png"

          }
          if (data.list[(i - 1) * 8].weather[0].main === "Mist") {
            icon.src = "https://openweathermap.org/img/wn/50d@2x.png"

          }
        }
      }
      );

    fetch(requestToday)
      .then(function (response) {
        return response.json();
      })
      .then(function (todayData) {
        var todayWeather = document.querySelector("#current-weather");
        var icon = document.querySelector(".today-img");
        var todayTemp = document.querySelector(".today-temp");
        var todayWind = document.querySelector(".today-wind");
        var todayHum = document.querySelector(".today-hum");

        todayWeather.textContent = today.format('MMM D, YYYY');
        todayTemp.textContent = "Temperature: " + (((todayData.main.temp) * 9 / 5) + 32).toFixed(2) + " °F";
        todayWind.textContent = "Wind Speed: " + todayData.wind.speed + " MPH";
        todayHum.textContent = "Humidity: " + todayData.main.humidity + " %";

        if (todayData.weather[0].main === "Clear") {
          icon.src = "https://openweathermap.org/img/wn/01d@2x.png"

        }
        if (todayData.weather[0].main === "Clouds") {
          icon.src = "https://openweathermap.org/img/wn/02d@2x.png"

        }
        if (todayData.weather[0].main === "Rain") {
          icon.src = "https://openweathermap.org/img/wn/10d@2x.png"

        }
        if (todayData.weather[0].main === "Thunderstorm") {
          icon.src = "https://openweathermap.org/img/wn/11d@2x.png"

        }
        if (todayData.weather[0].main === "Snow") {
          icon.src = "https://openweathermap.org/img/wn/13d@2x.png"

        }
        if (todayData.weather[0].main === "Mist") {
          icon.src = "https://openweathermap.org/img/wn/50d@2x.png"

        }
      }
      );
  }
}
)
