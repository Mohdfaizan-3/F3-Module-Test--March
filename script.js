"use strict";

const form = document.querySelector("#search-form");
const API_KEY = "Xhg19SnbNQT5JDYFvz0fbKSRvZgYZvuJ4wODBcBD";
const container = document.querySelector("#container");
const historyList = document.getElementById("search-history");

// to display ui
function displayUI(item) {
  const date = document.createElement("p");
  date.setAttribute("class", "date");
  date.innerText = `Picture on: ${item.date}`;
  const img = document.createElement("img");
  img.setAttribute("src", `${item.url}`);
  const title = document.createElement("h3");
  title.innerText = item.title;
  const explanation = document.createElement("p");
  explanation.innerText = item.explanation;
  container.append(date, img, title, explanation);
  addSearchToHistory();

}

// current image of day on load

async function getCurrentImageOfTheDay() {
  try {
    const currentDate = new Date().toISOString().split("T")[0];

    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?date=${currentDate}&api_key=${API_KEY}`
    );
    const data = await response.json();

    console.log(data);

    container.innerText = "";
    displayUI(data);
  } catch (error) {
    console.error(error);
  }
}

// save the date that is searched to loacal storage
function saveSearch(date) {
  const arr = JSON.parse(localStorage.getItem("searches")) || [];
  if (!arr.includes(date)) {
    arr.push(date);
    localStorage.setItem("searches", JSON.stringify(arr));
    addSearchToHistory();
  }
}


function displayAddedSearchUI(arr) {
    const ul = document.createElement("ul");

    arr.forEach((ele) => {
      console.log(ele);
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = ele;
      a.innerText = ele;
  
      li.style = "none";
      li.appendChild(a);
      ul.appendChild(li);
    });
  
    historyList.appendChild(ul);
  
    ul.addEventListener("click", (event) => {
      // check if the clicked element is a link
      if (event.target.tagName === "A") {
        // prevent the default link behavior
        event.preventDefault();
        // get the date from the link's text
        const date = event.target.innerText;
        // call the getImageOfTheDay function with the date
        getImageOfTheDay(date);
      }
    });
}
// search history
function addSearchToHistory() {
  historyList.innerText = "";
  const arr = JSON.parse(localStorage.getItem("searches")) || [];
  console.log(arr);
  displayAddedSearchUI(arr);
}

// getImage for particular date
async function getImageOfTheDay(date) {
  try {
    saveSearch(date);
    // console.log('date',date)
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${API_KEY}`
    );
    const data = await response.json();
    // console.log(data);
    container.innerText = "";
    displayUI(data);
    addSearchToHistory();
  } catch (error) {
    console.error(error);
  }
}

// getdate from form
function getFormData(e) {
  e.preventDefault();
  const date = form.date.value;
  if (date != "") {
    getImageOfTheDay(date);
  } else {
    console.log("enter the date");
  }
}

// form event listener
form.addEventListener("submit", getFormData);

// onload
getCurrentImageOfTheDay();
// search history
addSearchToHistory();
