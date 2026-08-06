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

let planetsData = [];

function formatApodDate(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatApiDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function setApodDateLimits() {
  const today = new Date();

  ApodDateInput.min = APOD_MIN_DATE;
  ApodDateInput.max = formatApiDate(today);
}

function updateApodDate(dateValue) {
  const formattedDate = formatApodDate(dateValue);

  ApodDate.innerHTML = `Astronomy Picture of the Day - ${formattedDate}`;
  ApodDateInput.value = dateValue;
  ApodDateInputWrapper.setAttribute("data-date", formattedDate);
}

function updateTodayApodDate() {
  const today = new Date();
  const inputDate = formatApiDate(today);

  updateApodDate(inputDate);
}

setApodDateLimits();
updateTodayApodDate();


sideBar.addEventListener("click", function (e) {
  const link = e.target.closest(".nav-link");
  if (!link) return;

  sections.forEach((section) => {
    section.classList.add("hidden");
  });

  document.getElementById(link.dataset.section).classList.remove("hidden");
});


async function getAPODAPI(){
ApodLoading.classList.remove("hidden")
ApodImage.classList.add("hidden")
    try{
const APODApi = await fetch('https://api.nasa.gov/planetary/apod?api_key=Ko4P2Q8yJjQSLUyhpZr7NS6tnUDgXNtCOCI2CVBR')
const APOD = await APODApi.json()
console.log(APOD)
ApodExplanation.innerHTML=APOD.explanation
ApodDateDetail.innerHTML=APOD.date
ApodTitle.innerHTML= APOD.title
ApodDateInfo.innerHTML=APOD.date
ApodMediaType.innerHTML=APOD.media_type
ApodCopyright.innerHTML=APOD.copyright || "NASA/JPL"
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

async function getAPODByDate(dateValue) {
  ApodLoading.classList.remove("hidden")
  ApodImage.classList.add("hidden")
      try{
  const APODApi = await fetch(`https://api.nasa.gov/planetary/apod?api_key=Ko4P2Q8yJjQSLUyhpZr7NS6tnUDgXNtCOCI2CVBR&date=${dateValue}`)
  const APOD = await APODApi.json()
  console.log(APOD)
  ApodExplanation.innerHTML=APOD.explanation
  ApodDateDetail.innerHTML=APOD.date
  ApodTitle.innerHTML= APOD.title
  ApodDateInfo.innerHTML=APOD.date
  ApodMediaType.innerHTML=APOD.media_type
  ApodCopyright.innerHTML=APOD.copyright || "NASA/JPL"
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

ApodDateInput.addEventListener("change", function () {
  updateApodDate(ApodDateInput.value);
});

LoadDateBtn.addEventListener("click", function () {
  if (!ApodDateInput.checkValidity()) {
    ApodDateInput.reportValidity();
    return;
  }

  getAPODByDate(ApodDateInput.value);
});

TodayApodBtn.addEventListener("click", function () {
  updateTodayApodDate();
  getAPODAPI();
});



function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatLaunchDate(dateValue) {
  if (!dateValue) return "TBD";

  return new Date(dateValue).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatLaunchTime(dateValue) {
  if (!dateValue) return "TBD";

  return new Date(dateValue).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });
}

function getDaysUntilLaunch(dateValue) {
  if (!dateValue) return "TBD";

  const launchDate = new Date(dateValue);
  const today = new Date();
  const difference = launchDate - today;

  return Math.max(Math.ceil(difference / (1000 * 60 * 60 * 24)), 0);
}

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

function getLaunchLocation(launch) {
  return launch.pad?.location?.name ||
    launch.pad?.name ||
    launch.pad?.map_location ||
    launch.pad?.map_name ||
    launch.location?.name ||
    launch.pad?.agency_id ||
    "Unknown Location";
}

function renderLaunchStatus(status) {
  return escapeHTML(status?.abbrev || status?.name || "TBD");
}

function renderFeaturedLaunch(launch) {
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
            ${image ? `<img src="${escapeHTML(image)}" alt="${name}" class="w-full h-full min-h-[400px] object-cover transition-transform duration-500 group-hover:scale-110" onerror="this.onerror=null;this.src='./assets/images/launch-placeholder.png';">` : `<img src="./assets/images/launch-placeholder.png" alt="Launch placeholder" class="w-full h-full min-h-[400px] object-cover transition-transform duration-500 group-hover:scale-110">`}
            <div class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderLaunchCard(launch) {
  const image = getLaunchImage(launch);
  const name = escapeHTML(launch.name);
  const provider = escapeHTML(launch.launch_service_provider?.name || "Unknown Provider");
  const rocket = escapeHTML(launch.rocket?.configuration?.name || "Unknown Rocket");
  const status = renderLaunchStatus(launch.status);
  const location = escapeHTML(getLaunchLocation(launch));

  return `
    <div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer">
      <div class="relative h-48 bg-slate-900/50 flex items-center justify-center">
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

async function getLaunches(){
    try {
      const launchesAPI = await fetch('https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10')
      const launchesJSON = await launchesAPI.json()
      const launchResults = launchesJSON.results || []

      LaunchesCount.innerHTML = `${launchResults.length} Launches`
      LaunchesCountMobile.innerHTML = launchResults.length

      if (!launchResults.length) return

      renderFeaturedLaunch(launchResults[0])
      LaunchesGrid.innerHTML = launchResults.slice(1).map(renderLaunchCard).join("")
    }
    catch(err){
      console.error(err)
    }
}
getLaunches()



const PLANET_QUICK_FACTS = {
    mercury: [
        "Smallest planet in the solar system",
        "No atmosphere to trap heat, so temperatures swing wildly",
        "A year on Mercury is just 88 Earth days",
        "Closest planet to the Sun"
    ],
    venus: [
        "Hottest planet due to a runaway greenhouse effect",
        "Rotates backwards compared to most other planets",
        "A day on Venus is longer than its year",
        "Thick atmosphere of mostly carbon dioxide"
    ],
    earth: [
        "Only known planet with liquid water on its surface",
        "Atmosphere contains 78% nitrogen",
        "Magnetic field protects it from solar wind",
        "Formed 4.54 billion years ago"
    ],
    mars: [
        "Home to Olympus Mons, the tallest volcano in the solar system",
        "Reddish color comes from iron oxide (rust) on its surface",
        "Has two small moons, Phobos and Deimos",
        "Days are close to Earth's at about 24.6 hours"
    ],
    jupiter: [
        "Largest planet in the solar system",
        "Great Red Spot is a storm larger than Earth",
        "Has the most moons of any planet",
        "Strong magnetic field, the strongest of any planet"
    ],
    saturn: [
        "Famous for its extensive ring system",
        "Least dense planet, it would float in water",
        "Has dozens of moons, including Titan",
        "Rings are made mostly of ice and rock"
    ],
    uranus: [
        "Rotates on its side, with an axial tilt of about 98 degrees",
        "Classified as an ice giant",
        "Has a faint ring system",
        "Coldest planetary atmosphere in the solar system"
    ],
    neptune: [
        "Windiest planet, with speeds over 2,000 km/h",
        "Farthest known planet from the Sun",
        "Discovered through mathematical prediction before it was seen",
        "Has a large dark storm similar to Jupiter's Great Red Spot"
    ]
};

function renderPlanetFacts(planet) {

    const factsList = document.querySelector("#planet-facts");

    if (!factsList) return;

    const key = (planet.englishName || planet.name || planet.id || "").toLowerCase();
    const facts = PLANET_QUICK_FACTS[key];

    if (!facts) return;

    factsList.innerHTML = facts.map(function(fact){
        return `<li class="flex items-start">
                    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                    <span class="text-slate-300">${fact}</span>
                </li>`;
    }).join("");

}

function renderPlanetDetails(planet) {

    if (!planet) return;

    renderPlanetFacts(planet);

    document.querySelector("#planet-detail-name").textContent = planet.englishName;
    document.querySelector("#planet-detail-description").textContent = planet.description;

    document.querySelector("#planet-detail-image").src = planet.image;

    document.querySelector("#planet-distance").textContent =
        planet.semimajorAxis.toLocaleString() + " km";

    document.querySelector("#planet-radius").textContent =
        planet.meanRadius.toLocaleString() + " km";

    document.querySelector("#planet-mass").textContent =
        `${planet.mass.massValue} × 10^${planet.mass.massExponent} kg`;

    document.querySelector("#planet-density").textContent =
        planet.density + " g/cm³";

    document.querySelector("#planet-orbital-period").textContent =
        planet.sideralOrbit + " days";

    document.querySelector("#planet-rotation").textContent =
        planet.sideralRotation + " hours";

    document.querySelector("#planet-moons").textContent =
        planet.moons ? planet.moons.length : 0;

    document.querySelector("#planet-gravity").textContent =
        planet.gravity + " m/s²";

    document.querySelector("#planet-discoverer").textContent =
        planet.discoveredBy || "Unknown";

    document.querySelector("#planet-discovery-date").textContent =
        planet.discoveryDate || "Unknown";

    document.querySelector("#planet-body-type").textContent =
        planet.type;

    document.querySelector("#planet-volume").textContent =
        `${planet.vol.volValue} × 10^${planet.vol.volExponent} km³`;

    document.querySelector("#planet-perihelion").textContent =
        planet.perihelion.toLocaleString() + " km";

    document.querySelector("#planet-aphelion").textContent =
        planet.aphelion.toLocaleString() + " km";

    document.querySelector("#planet-eccentricity").textContent =
        planet.eccentricity;

    document.querySelector("#planet-inclination").textContent =
        planet.inclination + "°";

    document.querySelector("#planet-axial-tilt").textContent =
        planet.axialTilt + "°";

    document.querySelector("#planet-temp").textContent =
        planet.avgTemp + " K";

    document.querySelector("#planet-escape").textContent =
        planet.escape.toLocaleString() + " m/s";

}

async function getPlanets() {

    try {

        const planetsAPI = await fetch("https://solar-system-opendata-proxy.vercel.app/api/planets");

        const planetsJSON = await planetsAPI.json();

        console.log(planetsJSON);

        planetsData = planetsJSON.bodies;

        renderPlanetDetails(planetsData[0]);

    } catch (err) {

        console.error(err);

    }

}

document.querySelectorAll(".planet-card").forEach(function(card){

    card.addEventListener("click", function(){

        const planetId = this.dataset.planetId;
        const planet = planetsData.find(function(p){

            return p.id === planetId ||
                (p.englishName && p.englishName.toLowerCase() === planetId);

        });

        renderPlanetDetails(planet);

    });

});
getPlanets()