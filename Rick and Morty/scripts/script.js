const root = document.querySelector("#root");

// Declared variables for HTML elements
let headerContainer,
  title,
  bodyContainer,
  sidebar,
  main,
  loadMoreButton,
  titleElement,
  dateAndEpisodeName,
  imagesContainer,
  divContainer,
  newCharacterContainer;

// Variable I will use to change the page
let page = 1;
//Variable I use to render first episode
let loadFirstEpisode = true;

let showCharacter = false;

// Function to create a NEW ELEMENT, append it to the PARENT ELEMENT, add ID and CLASSNAME
function createAndAppendElement(element, parentElement, id, className) {
  const newElement = document.createElement(element);
  parentElement.appendChild(newElement);
  if (id) newElement.setAttribute("id", id);
  if (className) newElement.classList.add(className);
  return newElement;
}

// Function to create initial HTML structure
function createInitialHTMLStructure() {
  headerContainer = createAndAppendElement("div", root, "header", "header");
  title = createAndAppendElement(
    "h1",
    headerContainer,
    "projectTitle",
    "project-title"
  );
  title.innerHTML = "RICK AND MORTY API";
  console.log("painting header");
  bodyContainer = createAndAppendElement(
    "div",
    root,
    "bodyContainer",
    "body-container"
  );
  console.log("painting body container");
  sidebar = createAndAppendElement("div", bodyContainer, "sidebar", "sidebar");
  console.log("painting sidebar");
  main = createAndAppendElement("div", bodyContainer, "main", "main");
  console.log("painting main area");
}

// Get Promise from API using fetch() method
async function getEpisodes(pageNum) {
  return fetch(`https://rickandmortyapi.com/api/episode?page=${pageNum}`).then(
    (data) => data.json()
  );
}

//Get Promise of characters from API
async function getCharacter(id) {
  const promise = await fetch(
    `https://rickandmortyapi.com/api/character/${id}`
  );
  const character = await promise.json();
  return character;
}

// Render the SIDEBAR
async function initialRenderSidebar() {
  // Resolved promise saved in episodes variable
  const episodes = await getEpisodes(1);

  // Pass Episodes Object and true as arguments
  renderEpisodesList(episodes, true);
  createLoadEpisodesButton();
  console.log("populating sidebar");
}

// Render Episodes List
function renderEpisodesList(episodesArray, isInitialRender) {
  //Added Unordered list where I will add all my <li>
  const unorderedList = document.createElement("ul");

  if (isInitialRender) {
    sidebar.appendChild(unorderedList);
  } else {
    // Inserts unorderedList before loadMoreButton
    loadMoreButton.before(unorderedList);
  }

  // Loop through list of episodes
  episodesArray.results.forEach((object) => {
    const li = createAndAppendElement("li", unorderedList);
    const a = createAndAppendElement("a", li);
    a.innerHTML = `Episode ${object.id}`;
    a.href = "#";
    a.addEventListener("click", (event) => {
      renderEpisode(object.id);
      event.preventDefault();
    });
  });
  page = page + 1;
}

// Create Button and add Event Listener to it
function createLoadEpisodesButton() {
  loadMoreButton = createAndAppendElement(
    "button",
    sidebar,
    "loadMoreButton",
    "load-more-button"
  );
  loadMoreButton.innerHTML = "Load Episodes";
  loadMoreButton.addEventListener("click", renderMoreEpisodes);
}

async function renderMoreEpisodes() {
  const newEpisodes = await getEpisodes(page);
  renderEpisodesList(newEpisodes, false);
}
//Render episode depends on ID parameter
async function renderEpisode(id) {
  const firstPromise = await fetch(
    `https://rickandmortyapi.com/api/episode/${id}`
  );

  const firstEpisode = await firstPromise.json();
  updateMainArea(firstEpisode);
}
// Render character depends on ID parameter

function updateMainArea(episode) {
  // this code won't execute on first load

  if (!loadFirstEpisode) {
    imagesContainer.remove();
    //titleElement.remove();
    //dateAndEpisodeName.remove();
    divContainer.remove();
  }
  // Will remove Character Node from the DOM
  if (showCharacter) {
    document.querySelector("#new-character-container").remove();
  }

  showCharacter = false;

  divContainer = createAndAppendElement(
    "div",
    main,
    undefined,
    "episode-title-container"
  );

  titleElement = createAndAppendElement("h2", divContainer);
  titleElement.innerText = `${episode.name}`;
  dateAndEpisodeName = createAndAppendElement("h3", divContainer);
  dateAndEpisodeName.innerText = `${episode.air_date} | ${episode.episode}`;
  imagesContainer = createAndAppendElement(
    "div",
    main,
    undefined,
    "image-container"
  );

  //Render characters
  //console.log(episode);
  episode.characters.forEach((character) => {
    fetch(character)
      .then((data) => data.json())
      .then((data) => {
        const characterContainer = createAndAppendElement(
          "div",
          imagesContainer
        );

        //Add addEventListener() to character container
        characterContainer.addEventListener("click", async () => {
          const characterData = await getCharacter(data.id);

          //Created Html structure for New Character
          newCharacterContainer = createAndAppendElement(
            "div",
            main,
            "new-character-container"
          );

          const imageOfNewCharacter = createAndAppendElement(
            "img",
            newCharacterContainer,
            "image-of-new-character"
          );
          imageOfNewCharacter.src = characterData.image;

          const nameAndInfoContainer = createAndAppendElement(
            "div",
            newCharacterContainer,
            "name-and-info-container"
          );

          const nameOfNewCharacter = createAndAppendElement(
            "h2",
            nameAndInfoContainer,
            "name-of-new-character"
          );
          nameOfNewCharacter.innerText = characterData.name;

          const infoOfNewCharacter = createAndAppendElement(
            "h4",
            nameAndInfoContainer,
            "info-new-character"
          );
          infoOfNewCharacter.innerHTML = `${characterData.species} | ${characterData.status} | ${characterData.gender} | ${characterData.origin.name}`;

          //Show  the list of episodes in which this particular character appears.
          const characterUnorderedEpisodeList = createAndAppendElement(
            "ul",
            newCharacterContainer
          );
          //console.log(characterData);
          characterData.episode.forEach((episodeElement) => {
            fetch(episodeElement)
              .then((data) => data.json())
              .then((data) => {
                const liEl = createAndAppendElement(
                  "li",
                  characterUnorderedEpisodeList
                );
                const aEl = createAndAppendElement("a", liEl);
                aEl.innerHTML = `Episode ${data.id}`;
                aEl.href = "#";
                const pEl = createAndAppendElement("p", liEl);
                pEl.innerHTML = data.episode;
                aEl.addEventListener("click", () => {
                  renderEpisode(data.id);
                });
              });
          });

          if (newCharacterContainer) {
            imagesContainer.remove();
            divContainer.remove();
          }
          showCharacter = true;
        });

        const image = createAndAppendElement(
          "img",
          characterContainer,
          "character-image"
        );
        image.src = data.image;

        const nameOfCharacter = createAndAppendElement("p", characterContainer);
        nameOfCharacter.innerHTML = `<strong>${data.name}</strong>`;
        const speciesAndStatus = createAndAppendElement(
          "p",
          characterContainer
        );
        speciesAndStatus.innerHTML = `${data.species} | ${data.status}`;
      });
  });
  if (loadFirstEpisode) loadFirstEpisode = false;
}

createInitialHTMLStructure();
initialRenderSidebar();

// Render first episode
renderEpisode(1);
