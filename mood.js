BING_ENDPOINT = "https://api.bing.microsoft.com/v7.0/images/search";

// Response handler function
function reqListener() {
  const response = JSON.parse(this.responseText);
  const relatedSearches = response["relatedSearches"];

  // Take care of Suggestions
  const suggestionsElement = document.querySelector(".suggestion-container");
  relatedSearches.forEach((data, index) => {
    let relatedSearch = data["text"];
    let div = document.createElement("div");
    // Add eventlistener for what happens when user clicks a related word
    div.addEventListener("click", () => {
      handleClickRecommendation(relatedSearch, index);
    });
    div.append(relatedSearch);
    div.setAttribute("id", "ri" + index);
    div.setAttribute("class", "rec-container");
    suggestionsElement.append(div);
  });

  // Take care of Images
  const imageResultDiv = document.querySelector(".suggested-image-container");
  const resultImages = response["value"];
  resultImages.forEach((data, index) => {
    let imageUrl = data["contentUrl"];
    let imageContainerDiv = document.createElement("div");
    let img = document.createElement("img");
    img.setAttribute("src", imageUrl);
    // Add eventlistener for what happens when user clicks an image
    img.addEventListener("click", () => {
      handleClickImage(imageUrl, index);
    });
    img.setAttribute("class", "suggested-image");
    img.setAttribute("id", "si" + index);
    imageContainerDiv.append(img);
    imageResultDiv.append(imageContainerDiv);
  });
}

// Run the API call and respond to user's intention to search
function runSearch() {
  clearElements();
  let query = document.querySelector(".search .form input").value;
  let queryurl = BING_ENDPOINT + "?q=" + encodeURIComponent(query);
  let request = new XMLHttpRequest();
  request.addEventListener("load", reqListener);
  request.open("GET", queryurl);

  request.setRequestHeader("Accept", "json");
  request.setRequestHeader("Ocp-Apim-Subscription-Key", BING_API_KEY);
  request.send();

  handleBingResponse();
  return false; 
}

function handleBingResponse() {
  window.location.hash = "results";
}

function closeSeachPane() {
  clearElements();
  window.location.hash = "";
}

document.querySelector("#exitButton").addEventListener("click", closeSeachPane);

// How to handle a recommendation click. Re-runs the search
function handleClickRecommendation(text, index) {
  clearElements();
  let input = document.querySelector(".search .form input");
  input.value = text;
  runSearch();
  const recommendation = document.querySelector("#ri" + index);
  recommendation.remove();
}

// How to handle clicking a image. Adds to the mood board while deleting the clicked 
// image from suggestions
function handleClickImage(imageUrl, index) {
  const moodBoardContainer = document.querySelector(
    ".mood-board-image-container"
  );
  const suggestedImage = document.querySelector("#si" + index);
  suggestedImage.parentElement.remove();

  let imageContainerDiv = document.createElement("div");
  let img = document.createElement("img");
  img.setAttribute("src", imageUrl);
  img.setAttribute("class", "selected-image")
  imageContainerDiv.append(img);
  imageContainerDiv.setAttribute("class", "selected-image-container")
  moodBoardContainer.append(imageContainerDiv);
}

// Helper function to clear everything from the previous search 
function clearElements(querySelectorName) {
  let classNames = [".suggestion-container", ".suggested-image-container"]
  classNames.forEach((querySelectorName) => {
    const container = document.querySelector(querySelectorName);
    while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  })
}
