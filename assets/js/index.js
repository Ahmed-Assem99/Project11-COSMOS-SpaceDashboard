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
const ApodDate= document.querySelector("#apod-date")
const ApodDateInput = document.querySelector("#apod-date-input")
const TodayApodBtn= document.querySelector("#today-apod-btn")
const LoadDateBtn = document.querySelector("#load-date-btn")

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

//today img
async function getAPODAPI(){
    try{
const APODApi = await fetch('https://api.nasa.gov/planetary/apod?api_key=Ko4P2Q8yJjQSLUyhpZr7NS6tnUDgXNtCOCI2CVBR')
const APOD = await APODApi.json()
console.log(APOD)
ApodExplanation.innerHTML=APOD.explanation
ApodDateDetail.innerHTML=APOD.date
ApodTitle.innerHTML= APOD.title
ApodDateInfo.innerHTML=APOD.date
ApodMediaType.innerHTML=APOD.media_type
ApodImage.src=APOD.url
}
catch(err){
console.error(err)
}}
getAPODAPI()




