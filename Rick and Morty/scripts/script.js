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
let showCharacterLocation = false;
let displayResident = false;
let showResidentLocation = false;

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

  bodyContainer = createAndAppendElement(
    "div",
    root,
    "bodyContainer",
    "body-container"
  );

  sidebar = createAndAppendElement("div", bodyContainer, "sidebar", "sidebar");
  main = createAndAppendElement("div", bodyContainer, "main", "main");
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

// Create Button and addEventListener to it
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

async function getEpisodesofCharacter(episodeElement) {
  const promise = await fetch(episodeElement);
  const promiseData = await promise.json();
  return promiseData;
}

async function getCharacterFromEpisode(character) {
  const promiseOfCharacter = await fetch(character);
  const promiseDataOfCharacter = await promiseOfCharacter.json();
  return promiseDataOfCharacter;
}

async function getResidentsListFromLocation(location) {
  const promiseGetResidentsList = await fetch(location);
  const promiseDataOfResidents = await promiseGetResidentsList.json();
  return promiseDataOfResidents;
}

async function getLocation(location) {
  const promiseOfLocation = await fetch(location);
  const promiseDataOfLocation = await promiseOfLocation.json();
  return promiseDataOfLocation;
}

// Render character depends on ID parameter
function updateMainArea(episode) {
  // this code won't execute on first load
  if (!loadFirstEpisode) {
    imagesContainer.remove();
    divContainer.remove();
  }

  if (displayResident && !showResidentLocation) {
    document.querySelector(".class-for-resident-container").remove();
  }
  // Will remove Character Node from the DOM
  if (showCharacter && !showCharacterLocation) {
    document.querySelector("#new-character-container").remove();
  }

  showCharacterLocation = false;
  showResidentLocation = false;
  showCharacter = false;
  displayResident = false;

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
  episode.characters.forEach(async (character) => {
    const data = await getCharacterFromEpisode(character);

    const characterContainer = createAndAppendElement("div", imagesContainer);

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

      // Create Button for looking for a location of the character
      const buttonLocation = createAndAppendElement(
        "button",
        nameAndInfoContainer,
        "info-location-button"
      );
      buttonLocation.innerHTML = "Go To The Origin Location";

      if (characterData.origin.name !== "unknown") {
        buttonLocation.addEventListener("click", async () => {
          document.querySelector("#new-character-container").remove();
          const characterOrigin = await getLocation(characterData.origin.url);

          divContainer = createAndAppendElement(
            "div",
            main,
            undefined,
            "episode-title-container"
          );

          titleElement = createAndAppendElement("h2", divContainer);
          titleElement.innerText = `${characterOrigin.name}`;
          dateAndEpisodeName = createAndAppendElement("h3", divContainer);
          dateAndEpisodeName.innerText = `${characterOrigin.type} | ${characterOrigin.dimension}`;
          imagesContainer = createAndAppendElement(
            "div",
            main,
            undefined,
            "image-container"
          );

          characterOrigin.residents.forEach(async (resident) => {
            const data = await getResidentsListFromLocation(resident);

            const characterContainer = createAndAppendElement(
              "div",
              imagesContainer
            );

            // add RESIDENT event listener here

            characterContainer.addEventListener("click", async () => {
              const characterData = await getCharacter(data.id);

              //Created Html structure for New Character
              newCharacterContainer = createAndAppendElement(
                "div",
                main,
                "new-character-container",
                "class-for-resident-container"
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

              // Create Button for looking for a location
              const buttonLocation = createAndAppendElement(
                "button",
                nameAndInfoContainer,
                "info-location-button"
              );
              buttonLocation.innerHTML = "Go To The Origin Location";

              if (characterData.origin.name !== "unknown") {
                buttonLocation.addEventListener("click", async () => {
                  document.querySelector("#new-character-container").remove();
                  const characterOrigin = await getLocation(
                    characterData.origin.url
                  );

                  divContainer = createAndAppendElement(
                    "div",
                    main,
                    undefined,
                    "episode-title-container"
                  );

                  titleElement = createAndAppendElement("h2", divContainer);
                  titleElement.innerText = `${characterOrigin.name}`;
                  dateAndEpisodeName = createAndAppendElement(
                    "h3",
                    divContainer
                  );
                  dateAndEpisodeName.innerText = `${characterOrigin.type} | ${characterOrigin.dimension}`;
                  imagesContainer = createAndAppendElement(
                    "div",
                    main,
                    undefined,
                    "image-container"
                  );

                  characterOrigin.residents.forEach(async (resident) => {
                    const data = await getResidentsListFromLocation(resident);

                    const characterContainer = createAndAppendElement(
                      "div",
                      imagesContainer
                    );

                    // add new event listener here

                    const image = createAndAppendElement(
                      "img",
                      characterContainer,
                      "character-image"
                    );
                    image.src = data.image;

                    const nameOfCharacter = createAndAppendElement(
                      "p",
                      characterContainer
                    );
                    nameOfCharacter.innerHTML = `<strong>${data.name}</strong>`;
                    const speciesAndStatus = createAndAppendElement(
                      "p",
                      characterContainer,
                      "species-status"
                    );
                    speciesAndStatus.innerHTML = `${data.species} | ${data.status}`;
                  });

                  showResidentLocation = true;
                });
              }

              if (characterData.origin.name === "unknown") {
                buttonLocation.addEventListener("click", () => {
                  alert("I DON'T HAVE ORIGIN LOCATION");
                });
              }

              //Show  the list of episodes in which this particular character appears.
              const divForCharacter = createAndAppendElement(
                "div",
                newCharacterContainer,
                "div-for-character"
              );
              const characterUnorderedEpisodeList = createAndAppendElement(
                "ul",
                divForCharacter
              );
              
              characterData.episode.forEach(async (episodeElement) => {
                const data = await getEpisodesofCharacter(episodeElement);
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
              if (newCharacterContainer) {
                imagesContainer.remove();
                divContainer.remove();
              }
              displayResident = true;
            });

            const image = createAndAppendElement(
              "img",
              characterContainer,
              "character-image"
            );
            image.src = data.image;

            const nameOfCharacter = createAndAppendElement(
              "p",
              characterContainer
            );
            nameOfCharacter.innerHTML = `<strong>${data.name}</strong>`;
            const speciesAndStatus = createAndAppendElement(
              "p",
              characterContainer,
              "species-status"
            );
            speciesAndStatus.innerHTML = `${data.species} | ${data.status}`;
          });

          showCharacterLocation = true;
        });
      }

      if (characterData.origin.name === "unknown") {
        buttonLocation.addEventListener("click", () => {
          alert("I DON'T HAVE ORIGIN LOCATION");
        });
      }

      //Show  the list of episodes in which this particular character appears.
      const divForCharacter = createAndAppendElement(
        "div",
        newCharacterContainer,
        "div-for-character"
      );
      const characterUnorderedEpisodeList = createAndAppendElement(
        "ul",
        divForCharacter
      );

      characterData.episode.forEach(async (episodeElement) => {
        const data = await getEpisodesofCharacter(episodeElement);
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
      characterContainer,
      "species-status"
    );
    speciesAndStatus.innerHTML = `${data.species} | ${data.status}`;
  });

  if (loadFirstEpisode) loadFirstEpisode = false;
}

createInitialHTMLStructure();
initialRenderSidebar();

// Render first episode
renderEpisode(1);
