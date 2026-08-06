const todayInSpace = document.getElementById("today-in-space");
const launches = document.getElementById("launches");
const planets = document.getElementById("planets");
const sideBar = document.getElementById("sidebar");
const sections = document.querySelectorAll(".app-section");
const ApodExplanation = document.querySelector("#apod-explanation")
const ApodDateDetail = document.querySelector("#apod-date-detail")
const ApodTitle = document.querySelector("#apod-title")
const ApodDateInfo=document.querySelector("#apod-date-info")
const ApodMediaType = document.querySelector("#apod-media-type")
const ApodImage= document.querySelector("#apod-image")
const ApodLoading = document.querySelector("#apod-loading")
const ApodDate= document.querySelector("#apod-date")
const ApodDateInput = document.querySelector("#apod-date-input")
const ApodDateInputWrapper = document.querySelector(".date-input-wrapper")
const TodayApodBtn= document.querySelector("#today-apod-btn")
const LoadDateBtn = document.querySelector("#load-date-btn")
const APOD_MIN_DATE = "1995-06-16";

// Converts an API date value like "2026-08-06" to readable text.
function formatApodDate(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Formats Date objects for the NASA API and date input: YYYY-MM-DD.
function formatApiDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Restricts APOD dates from the first APOD date through today.
function setApodDateLimits() {
  const today = new Date();

  ApodDateInput.min = APOD_MIN_DATE;
  ApodDateInput.max = formatApiDate(today);
}

// Updates the title text, real input value, and custom visible date label.
function updateApodDate(dateValue) {
  const formattedDate = formatApodDate(dateValue);

  ApodDate.innerHTML = `Astronomy Picture of the Day - ${formattedDate}`;
  ApodDateInput.value = dateValue;
  ApodDateInputWrapper.setAttribute("data-date", formattedDate);
}

// Resets the selected APOD date to today's local date.
function updateTodayApodDate() {
  const today = new Date();
  const inputDate = formatApiDate(today);

  updateApodDate(inputDate);
}

setApodDateLimits();
updateTodayApodDate();

// SideBar Section

sideBar.addEventListener("click", function (e) {
  const link = e.target.closest(".nav-link");
  if (!link) return;

  sections.forEach((section) => {
    section.classList.add("hidden");
  });

  document.getElementById(link.dataset.section).classList.remove("hidden");
});

// Today in Space Section

// Loads today's APOD data and keeps the loader visible until the image finishes.
async function getAPODAPI(){
ApodLoading.classList.remove("hidden")
ApodImage.classList.add("hidden")
    try{
const APODApi = await fetch('https://api.nasa.gov/planetary/apod?api_key=Ko4P2Q8yJjQSLUyhpZr7NS6tnUDgXNtCOCI2CVBR')
const APOD = await APODApi.json()
console.log(APOD)
// Fill the APOD details after receiving the API response.
ApodExplanation.innerHTML=APOD.explanation
ApodDateDetail.innerHTML=APOD.date
ApodTitle.innerHTML= APOD.title
ApodDateInfo.innerHTML=APOD.date
ApodMediaType.innerHTML=APOD.media_type
// Hide the loader only after the image file itself has loaded.
ApodImage.onload = function () {
  ApodLoading.classList.add("hidden")
  ApodImage.classList.remove("hidden")
}
ApodImage.src=APOD.url
}
catch(err){
console.error(err)
ApodLoading.classList.add("hidden")
}}
getAPODAPI()

// Loads APOD data for the selected date in YYYY-MM-DD format.
async function getAPODByDate(dateValue) {
  ApodLoading.classList.remove("hidden")
  ApodImage.classList.add("hidden")
      try{
  const APODApi = await fetch(`https://api.nasa.gov/planetary/apod?api_key=Ko4P2Q8yJjQSLUyhpZr7NS6tnUDgXNtCOCI2CVBR&date=${dateValue}`)
  const APOD = await APODApi.json()
  console.log(APOD)
  // Update the same APOD UI fields with the selected date's response.
  ApodExplanation.innerHTML=APOD.explanation
  ApodDateDetail.innerHTML=APOD.date
  ApodTitle.innerHTML= APOD.title
  ApodDateInfo.innerHTML=APOD.date
  ApodMediaType.innerHTML=APOD.media_type
  // Wait for the selected date's image before hiding the loading state.
  ApodImage.onload = function () {
    ApodLoading.classList.add("hidden")
    ApodImage.classList.remove("hidden")
  }
  ApodImage.src=APOD.url
  }
  catch(err){
  console.error(err)
  ApodLoading.classList.add("hidden")
  }}

// Changing the date input updates the visible date text immediately.
ApodDateInput.addEventListener("change", function () {
  updateApodDate(ApodDateInput.value);
});

// Load the selected date only if it is inside the allowed APOD date range.
LoadDateBtn.addEventListener("click", function () {
  if (!ApodDateInput.checkValidity()) {
    ApodDateInput.reportValidity();
    return;
  }

  getAPODByDate(ApodDateInput.value);
});

// Reset the controls and API data back to today's APOD.
TodayApodBtn.addEventListener("click", function () {
  updateTodayApodDate();
  getAPODAPI();
});
