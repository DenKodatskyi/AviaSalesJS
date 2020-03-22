const formSearch = document.querySelector(".form-search");
const inputCitiesFrom = document.querySelector(".input__cities-from");
const dropdownCitiesFrom = document.querySelector(".dropdown__cities-from");
const inputCitiesTo = document.querySelector(".input__cities-to");
const dropdownCitiesTo = document.querySelector(".dropdown__cities-to");
const inputDateDepart = document.querySelector(".input__date-depart");


// const citiesApi = "../data/cities.json";
const citiesApi = "http://api.travelpayouts.com/data/ru/cities.json";
const proxy = "https://cors-anywhere.herokuapp.com/";
const API_KEY = "50f8b211e11b54ddb404320ecb7dfc0d";
const calendar = "http://min-prices.aviasales.ru/calendar_preload"; 


let city = [];


const getData = (url, callback) => {
  const request = new XMLHttpRequest();

  request.open("GET", url);

  request.addEventListener("readystatechange", () => {
    if (request.readyState !== 4) return;

    if (request.status === 200) {
      callback(request.response);
    } else {
      console.error(request.status);
    }
  });

  request.send();
};


const showCity = (input, list) => {
  list.textContent = "";

  if (input.value !== "") {
    const filterCity = city.filter((item) => {
        const fixItem = item.name.toLowerCase();
        return fixItem.includes(input.value.toLowerCase());
    });

    filterCity.forEach((item) => {
      const li = document.createElement("li");
      li.classList.add("dropdown__city");
      li.textContent = item.name;
      list.append(li);
    });
  }
};

const selectCity = (e, input, list) => {
  const target = e.target;
  if (target.tagName.toLowerCase() === "li") {
    input.value = target.textContent;
    list.textContent = "";
  }
}


inputCitiesFrom.addEventListener("input", () => {
  showCity(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener("input", () => {
  showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener("click", (e) => {
  selectCity(e, inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener("click", (e) => {
  selectCity(e, inputCitiesTo, dropdownCitiesTo);
});


getData(proxy + citiesApi, (data) => {
  city = JSON.parse(data).filter((item) => {
    return item.name;
  });
});




