const todayInSpace = document.getElementById("today-in-space");
const launches = document.getElementById("launches");
const planets = document.getElementById("planets");
const FeaturedLaunch = document.querySelector("#featured-launch")
const LaunchesGrid = document.querySelector("#launches-grid")
const LaunchesCount = document.querySelector("#launches-count")
const LaunchesCountMobile = document.querySelector("#launches-count-mobile")
const sideBar = document.getElementById("sidebar");
const sections = document.querySelectorAll(".app-section");
const ApodExplanation = document.querySelector("#apod-explanation")
const ApodDateDetail = document.querySelector("#apod-date-detail")
const ApodTitle = document.querySelector("#apod-title")
const ApodDateInfo=document.querySelector("#apod-date-info")
const ApodCopyright = document.querySelector("#apod-copyright")
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
ApodCopyright.innerHTML=APOD.copyright || "NASA/JPL"
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
  ApodCopyright.innerHTML=APOD.copyright || "NASA/JPL"
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


//Launches Section

// Escapes API text before inserting it with innerHTML.
function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Shows launch dates in a short readable format.
function formatLaunchDate(dateValue) {
  if (!dateValue) return "TBD";

  return new Date(dateValue).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Shows launch times in UTC because launch APIs usually return UTC timestamps.
function formatLaunchTime(dateValue) {
  if (!dateValue) return "TBD";

  return new Date(dateValue).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });
}

// Calculates how many full days remain until the launch.
function getDaysUntilLaunch(dateValue) {
  if (!dateValue) return "TBD";

  const launchDate = new Date(dateValue);
  const today = new Date();
  const difference = launchDate - today;

  return Math.max(Math.ceil(difference / (1000 * 60 * 60 * 24)), 0);
}

// Tries different possible image fields because API responses can vary.
function getLaunchImage(launch) {
  if (typeof launch.image === "string") return launch.image;

  return launch.image?.image_url ||
    launch.image?.thumbnail_url ||
    launch.image?.url ||
    launch.mission?.image?.image_url ||
    launch.rocket?.configuration?.image?.image_url ||
    launch.rocket?.configuration?.image_url ||
    launch.launch_service_provider?.image?.image_url ||
    "";
}

// Tries different possible location fields and falls back if none exist.
function getLaunchLocation(launch) {
  return launch.pad?.location?.name ||
    launch.pad?.name ||
    launch.pad?.map_location ||
    launch.pad?.map_name ||
    launch.location?.name ||
    launch.pad?.agency_id ||
    "Unknown Location";
}

// Gets a short launch status label like Go, TBD, or TBC.
function renderLaunchStatus(status) {
  return escapeHTML(status?.abbrev || status?.name || "TBD");
}

// Builds the large featured launch card from the first API result.
function renderFeaturedLaunch(launch) {
  // Read and clean the data before placing it into the HTML template.
  const image = getLaunchImage(launch);
  const name = escapeHTML(launch.name);
  const provider = escapeHTML(launch.launch_service_provider?.name || "Unknown Provider");
  const rocket = escapeHTML(launch.rocket?.configuration?.name || "Unknown Rocket");
  const status = renderLaunchStatus(launch.status);
  const location = escapeHTML(getLaunchLocation(launch));
  const country = escapeHTML(launch.pad?.country_code || "Unknown");
  const description = escapeHTML(launch.mission?.description || "No mission description available.");

  FeaturedLaunch.innerHTML = `
    <div class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all">
      <div class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
        <div class="flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-3 mb-4">
              <span class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2">
                <i class="fas fa-star"></i>
                Featured Launch
              </span>
              <span class="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">${status}</span>
            </div>
            <h3 class="text-3xl font-bold mb-3 leading-tight">${name}</h3>
            <div class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400">
              <div class="flex items-center gap-2"><i class="fas fa-building"></i><span>${provider}</span></div>
              <div class="flex items-center gap-2"><i class="fas fa-rocket"></i><span>${rocket}</span></div>
            </div>
            <div class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6">
              <i class="fas fa-clock text-2xl text-blue-400"></i>
              <div>
                <p class="text-2xl font-bold text-blue-400">${getDaysUntilLaunch(launch.net)}</p>
                <p class="text-xs text-slate-400">Days Until Launch</p>
              </div>
            </div>
            <div class="grid xl:grid-cols-2 gap-4 mb-6">
              <div class="bg-slate-900/50 rounded-xl p-4"><p class="text-xs text-slate-400 mb-1 flex items-center gap-2"><i class="fas fa-calendar"></i>Launch Date</p><p class="font-semibold">${formatLaunchDate(launch.net)}</p></div>
              <div class="bg-slate-900/50 rounded-xl p-4"><p class="text-xs text-slate-400 mb-1 flex items-center gap-2"><i class="fas fa-clock"></i>Launch Time</p><p class="font-semibold">${formatLaunchTime(launch.net)}</p></div>
              <div class="bg-slate-900/50 rounded-xl p-4"><p class="text-xs text-slate-400 mb-1 flex items-center gap-2"><i class="fas fa-map-marker-alt"></i>Location</p><p class="font-semibold text-sm">${location}</p></div>
              <div class="bg-slate-900/50 rounded-xl p-4"><p class="text-xs text-slate-400 mb-1 flex items-center gap-2"><i class="fas fa-globe"></i>Country</p><p class="font-semibold">${country}</p></div>
            </div>
            <p class="text-slate-300 leading-relaxed mb-6">${description}</p>
          </div>
        </div>
        <div class="relative">
          <div class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50">
            <!-- If the API image is broken, the onerror fallback switches to the local placeholder. -->
            ${image ? `<img src="${escapeHTML(image)}" alt="${name}" class="w-full h-full min-h-[400px] object-cover transition-transform duration-500 group-hover:scale-110" onerror="this.onerror=null;this.src='./assets/images/launch-placeholder.png';">` : `<img src="./assets/images/launch-placeholder.png" alt="Launch placeholder" class="w-full h-full min-h-[400px] object-cover transition-transform duration-500 group-hover:scale-110">`}
            <div class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Builds one small launch card for the "All Upcoming Launches" grid.
function renderLaunchCard(launch) {
  // Keep API data in variables so the template stays easier to read.
  const image = getLaunchImage(launch);
  const name = escapeHTML(launch.name);
  const provider = escapeHTML(launch.launch_service_provider?.name || "Unknown Provider");
  const rocket = escapeHTML(launch.rocket?.configuration?.name || "Unknown Rocket");
  const status = renderLaunchStatus(launch.status);
  const location = escapeHTML(getLaunchLocation(launch));

  return `
    <div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer">
      <div class="relative h-48 bg-slate-900/50 flex items-center justify-center">
        <!-- Real launch images and placeholder images both scale on hover. -->
        ${image ? `<img src="${escapeHTML(image)}" alt="${name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onerror="this.onerror=null;this.src='./assets/images/launch-placeholder.png';">` : `<img src="./assets/images/launch-placeholder.png" alt="Launch placeholder" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">`}
        <div class="absolute top-3 right-3">
          <span class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">${status}</span>
        </div>
      </div>
      <div class="p-5">
        <div class="mb-3">
          <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">${name}</h4>
          <p class="text-sm text-slate-400 flex items-center gap-2"><i class="fas fa-building text-xs"></i>${provider}</p>
        </div>
        <div class="space-y-2 mb-4">
          <div class="flex items-center gap-2 text-sm"><i class="fas fa-calendar text-slate-500 w-4"></i><span class="text-slate-300">${formatLaunchDate(launch.net)}</span></div>
          <div class="flex items-center gap-2 text-sm"><i class="fas fa-clock text-slate-500 w-4"></i><span class="text-slate-300">${formatLaunchTime(launch.net)}</span></div>
          <div class="flex items-center gap-2 text-sm"><i class="fas fa-rocket text-slate-500 w-4"></i><span class="text-slate-300">${rocket}</span></div>
          <div class="flex items-center gap-2 text-sm"><i class="fas fa-map-marker-alt text-slate-500 w-4"></i><span class="text-slate-300 line-clamp-1">${location}</span></div>
        </div>
      </div>
    </div>
  `;
}

// Fetches upcoming launches and renders them into the launches section.
async function getLaunches(){
    try {
      const launchesAPI = await fetch('https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10')
      const launchesJSON = await launchesAPI.json()
      // The SpaceDevs API stores the launch list inside the results array.
      const launchResults = launchesJSON.results || []

      // Update launch counters in the sidebar/header.
      LaunchesCount.innerHTML = `${launchResults.length} Launches`
      LaunchesCountMobile.innerHTML = launchResults.length

      if (!launchResults.length) return

      // First launch becomes featured, remaining launches become grid cards.
      renderFeaturedLaunch(launchResults[0])
      LaunchesGrid.innerHTML = launchResults.slice(1).map(renderLaunchCard).join("")
    }
    catch(err){
      console.error(err)
    }
}
getLaunches()


// Planets Section

