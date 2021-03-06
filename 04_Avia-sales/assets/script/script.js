const formSearch = document.querySelector(".form-search");
const inputCitiesFrom = document.querySelector(".input__cities-from");
const dropdownCitiesFrom = document.querySelector(".dropdown__cities-from");
const inputCitiesTo = document.querySelector(".input__cities-to");
const dropdownCitiesTo = document.querySelector(".dropdown__cities-to");
const inputDateDepart = document.querySelector(".input__date-depart");
const cheapestTicket = document.querySelector("#cheapest-ticket");
const otherCheapTickets = document.querySelector("#other-cheap-tickets");


// const citiesApi = "../data/cities.json";
const citiesApi = "http://api.travelpayouts.com/data/ru/cities.json";
const proxy = "https://cors-anywhere.herokuapp.com/";
const API_KEY = "50f8b211e11b54ddb404320ecb7dfc0d";
const calendar = "http://min-prices.aviasales.ru/calendar_preload";
const MAX_COUNT = 8;


let city = [];


//  функции
const getData = (url, callback, reject = console.error) => {
  
  const request = new XMLHttpRequest();

  request.open("GET", url);

  request.addEventListener("readystatechange", () => {
    if (request.readyState !== 4) return;

    if (request.status === 200) {
      callback(request.response);
    } else {
      reject(request.status);
    }
  });

    request.send(); 
};


const showCity = (input, list) => {
  list.textContent = "";

  if (input.value !== "") {
    const filterCity = city.filter((item) => {
      const fixItem = item.name.toLowerCase();
      return fixItem.startsWith(input.value.toLowerCase());
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
};

const getNameCity = (code) => {
  const objCity = city.find((item) => item.code === code);
  return objCity.name;
};

const getDate = (date) => {
  return new Date(date).toLocaleString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

const getChanges = (num) => {
  if (num) {
    return num === 1 ? "with one transplants" : "with couple transplants";
  } else {
    return "no transplants";
  }
};

const getLinkAviasales = (data) => {
  let link = "https://www.aviasales.ru/search/";
  link += data.origin;
  const date = new Date(data.depart_date);
  const day = date.getDate();
  link += day < 10 ? "0" + day : day;
  const month = date.getMonth()+1;
  link += month < 10 ? "0" + month : month;
  link += data.destination;
  link += "1";

  return link;
};

const createCard = (data) => {
  const ticket = document.createElement("article");
  ticket.classList.add("ticket");
  let deep = "";

  if (data) {
    deep = `
    <h3 class="agent"${data.gate}</h3>
<div class="ticket__wrapper">
	<div class="left-side">
		<a href="${getLinkAviasales(data)}" target="_blank" class="button button__buy">Buy 
			${data.value}y.e.</a>
	</div>
	<div class="right-side">
		<div class="block-left">
			<div class="city__from">Departure from the city
				<span class="city__name">${getNameCity(data.origin)}</span>
			</div>
			<div class="date">${getDate(data.depart_date)}</div>
		</div>

		<div class="block-right">
			<div class="changes">${getChanges(data.number_of_changes)}</div>
			<div class="city__to">Destination City:
				<span class="city__name">${getNameCity(data.destination)}</span>
			</div>
		</div>
	</div>
</div>
    `;
  } else {
    deep = "<h3>no have tickets on this date</h3>"
  }

  ticket.insertAdjacentHTML("afterbegin", deep);

  return ticket;
};

const renderCheapDay = (cheapTicket) => {
  cheapestTicket.getElementsByClassName.display = "block";
  cheapestTicket.innerHTML = "<h2>The cheapest ticket for the selected date</h2>";

  const ticket = createCard(cheapTicket[0]);
  cheapestTicket.append(ticket);
};

const renderCheapYear = (cheapTickets) => {
  cheapestTicket.getElementsByClassName.display = "block";
  otherCheapTickets.innerHTML = "<h2>Cheapest tickets for other dates</h2>";

  cheapTickets.sort((a, b) => a.value - b.value);
  for(let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++) {
    const ticket = createCard(cheapTickets[i]);
    otherCheapTickets.append(ticket);
  }
};

const renderCheap = (data, date) => {
  const cheapTicketYear = JSON.parse(data).best_prices;

  const cheapTicketDay = cheapTicketYear.filter((item) => {
    return item.depart_date === date;
  });

  renderCheapDay(cheapTicketDay);
  renderCheapYear(cheapTicketYear);
};


// обработка событий
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

formSearch.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const cityFrom = city.find((item) => inputCitiesFrom.value === item.name);
  const cityTo = city.find((item) => inputCitiesTo.value === item.name);

  const formData = {
    from: cityFrom,
    to: cityTo,
    when: inputDateDepart.value,
  };

  if (formData.form || formData.to) {
    const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true`;

    getData(calendar + requestData, (data) => {
      renderCheap(data, formData.when);
    }, (e) => {
      alert("no have flights");
      console.log(e);  
    });
  } else {
    alert("error! typing correct city");
  }

});


// вызов функции
getData(proxy + citiesApi, (data) => {
  city = JSON.parse(data).filter(item => item.name);
  city.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    return 0;
  });
  console.log(city);
});

// getData(proxy + calendar + "?depart_date=2020-05-25&origin=SVX&destination=KGD&one_way=true&token=" + API_KEY, (data) => {
//   const cheapTicket = JSON.parse(data).best_prices.filter(item => item.depart_date === "2020-05-29")
//   console.log(cheapTicket);
// });







