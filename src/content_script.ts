// content_script.ts


const LanguageDetect = require('languagedetect');
import Swal from 'sweetalert2'
const lngDetector = new LanguageDetect();
var PREFERRED_LANGUAGES: Array<string> = [];
var JOB_SEARCH_RESULTS_RAISED = false;
var MAX_ATTEMPT = 20;
var DELAY_TIME_MS = 150;
var firstSuitableCardIndex: number = -1;
var jobSearchResultListSubTitleTemp = "";

function isPreferred(text: string) {
  let detectResult = lngDetector.detect(text);
  if (!detectResult)
    return true;

  return PREFERRED_LANGUAGES.includes(detectResult[0][0]);
}

// Function to filter a job via content language
function filterJobByLanguage(jobListing: any, index: number) {
  let jobDescriptionElement: any = document.querySelector('.jobs-description-content__text');
  let jobDescription = jobDescriptionElement.innerText.trim();

  if (!isPreferred(jobDescription)) {
    jobListing.style.display = 'none';
    return;
  }

  if (firstSuitableCardIndex == -1)
    firstSuitableCardIndex = index;

}

async function clickJobSearchResults() {

  JOB_SEARCH_RESULTS_RAISED = true;
  fireSwal();

  let paginationButton = document.querySelectorAll('.artdeco-pagination__indicator');
  paginationButton.forEach(btn => btn.addEventListener('click', function () {
    JOB_SEARCH_RESULTS_RAISED = false;
  }));

  // for getting all jobResults at current page nedeed scroll
  scrollToBottom();
  await new Promise((resolve) => setTimeout(resolve, 700));
  scrollToTop();
  await new Promise((resolve) => setTimeout(resolve, 700));


  let jobResults = document.getElementsByClassName('job-card-container--clickable');


  for (let i = 0; i < jobResults.length; i++) {
    let jobResult: any = jobResults[i];
    let attempCount = 0;
    // Click on the job search result 
    jobResult.click();

    // Waiting for job details loading
    let jobTitle:any = document.querySelector('.jobs-search__job-details--container')?.ariaLabel;
    let jobResultTitle:any = jobResult.querySelector('.artdeco-entity-lockup__title').innerText;
    let jobDescription = document.querySelector('.jobs-description-content__text')?.querySelector('span')?.innerText

    while (attempCount <= MAX_ATTEMPT && (jobTitle.replace(/\s/g, '') !== jobResultTitle.replace(/\s/g, '') || jobDescription == "")) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_TIME_MS));
      jobTitle = document.querySelector('.jobs-search__job-details--container')?.ariaLabel;
      jobResultTitle = jobResult.querySelector('.artdeco-entity-lockup__title').innerText;
      jobDescription = document.querySelector('.jobs-description-content__text')?.querySelector('span')?.innerText
      attempCount++;
    }

    // checking for job content language
    filterJobByLanguage(jobResult, i);
  }

  // focus on first job card after filtering
  scrollToTop();
  let jobResultFirstSuitable: any = jobResults[firstSuitableCardIndex];
  jobResultFirstSuitable?.click();
  jobResultFirstSuitable?.focus();
  firstSuitableCardIndex = -1;

}



function scrollToBottom() {
  let jobSearchResultListDiv = document.querySelector('.jobs-search-results-list');

  if (jobSearchResultListDiv) {
    jobSearchResultListDiv.scrollTo({
      top: jobSearchResultListDiv.scrollHeight,
      behavior: 'smooth'
    });
  }
}

function scrollToTop() {
  let jobSearchResultListDiv = document.querySelector('.jobs-search-results-list');
  if (jobSearchResultListDiv) {
    jobSearchResultListDiv.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

function fireSwal() {
  let timerInterval: any
  Swal.fire({
    title: 'Linkedin Job Language Filter',
    html: 'Processing... Please wait.',
    timer: 7000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading()
    },
    willClose: () => {
      clearInterval(timerInterval)
    }
  })
}


// Add listeners to trigger the filtering 
setInterval(async function () {

  let jobSearchResultListDiv = document.querySelector('.jobs-search-results-list');
  let jobSearchResultListSubTitle: any = document.querySelector('.jobs-search-results-list__subtitle');

  if (!jobSearchResultListDiv || jobSearchResultListSubTitle.innerText !== jobSearchResultListSubTitleTemp) {
    JOB_SEARCH_RESULTS_RAISED = false;
  }

  jobSearchResultListSubTitleTemp = jobSearchResultListSubTitle?.innerText;

  if (window.location.pathname === "/jobs/search/" && !JOB_SEARCH_RESULTS_RAISED) {
    await setPreferences();
    if (PREFERRED_LANGUAGES.length == 0)
      return;

    clickJobSearchResults();
  }
}, 3000);


// Watch for changes to the user's options & apply them
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.options?.newValue) {
    PREFERRED_LANGUAGES = [];

    if (changes.options.newValue.optionChkEnglish)
      PREFERRED_LANGUAGES.push("english");

    if (changes.options.newValue.optionChkDutch)
      PREFERRED_LANGUAGES.push("dutch");

    if (changes.options.newValue.optionChkFrench)
      PREFERRED_LANGUAGES.push("french");

    if (changes.options.newValue.optionChkGerman)
      PREFERRED_LANGUAGES.push("german");

    if (changes.options.newValue.optionChkItalian)
      PREFERRED_LANGUAGES.push("italian");

    if (changes.options.newValue.optionChkPolish)
      PREFERRED_LANGUAGES.push("polish");

    if (changes.options.newValue.optionChkSpanish)
      PREFERRED_LANGUAGES.push("spanish");

    if (changes.options.newValue.optionChkTurkish)
      PREFERRED_LANGUAGES.push("turkish");

    JOB_SEARCH_RESULTS_RAISED = false;
    location.reload();

  }
});

async function setPreferences() {
  const data = await chrome.storage.sync.get("options");
  PREFERRED_LANGUAGES = [];

  if (data.options?.optionChkEnglish)
    PREFERRED_LANGUAGES.push("english");

  if (data.options?.optionChkDutch)
    PREFERRED_LANGUAGES.push("dutch");

  if (data.options?.optionChkFrench)
    PREFERRED_LANGUAGES.push("french");

  if (data.options?.optionChkGerman)
    PREFERRED_LANGUAGES.push("german");

  if (data.options?.optionChkItalian)
    PREFERRED_LANGUAGES.push("italian");

  if (data.options?.optionChkPolish)
    PREFERRED_LANGUAGES.push("polish");

  if (data.options?.optionChkSpanish)
    PREFERRED_LANGUAGES.push("spanish");

  if (data.options?.optionChkTurkish)
    PREFERRED_LANGUAGES.push("turkish");
}



