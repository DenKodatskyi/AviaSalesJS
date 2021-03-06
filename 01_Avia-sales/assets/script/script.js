const formSearch = document.querySelector(".form-search");
const inputCitiesFrom = document.querySelector(".input__cities-from");
const dropdownCitiesFrom = document.querySelector(".dropdown__cities-from");
const inputCitiesTo = document.querySelector(".input__cities-to");
const dropdownCitiesTo = document.querySelector(".dropdown__cities-to");
const inputDateDepart = document.querySelector(".input__date-depart");

const city = ["Moskow", "Piterburg", "Minsk", "Karaganda", "Chelabinsk", "Kerch", "Volgograd", "Samara", "Dnepr", "Ekaterenburg", "Odessa", "Uhan", "Shimkent", "Nowgorod", "Kaliningrad", "Vrotslaw", "Rostov"];

const showCity = (input, list) => {
  list.textContent = "";

  if (input.value !== "") {
    const filterCity = city.filter((item) => {
      const fixItem = item.toLowerCase();
      return fixItem.includes(input.value.toLowerCase());
    });

    filterCity.forEach((item) => {
      const li = document.createElement("li");
      li.classList.add("dropdown__city");
      li.textContent = item;
      list.append(li);
    });
  }
};

inputCitiesFrom.addEventListener("input", () => {
  showCity(inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesFrom.addEventListener("click", (event) => {
  const target = event.target;  
  if (target.tagName.toLowerCase() === "li") {
    inputCitiesFrom.value = target.textContent;
    dropdownCitiesFrom.textContent = "";
  }
});









