const root = document.getElementById("root");

const headerSection = document.createElement("div");
headerSection.id = "header";
headerSection.innerHTML = "<h1>Rick and Morty API</h1>";
root.appendChild(headerSection);

const sidebar = document.createElement("div");
sidebar.id = "sidebar";
root.appendChild(sidebar);

const main = document.createElement("div");
main.id = "main";
root.appendChild(main);

const episodes = document.createElement("div");
episodes.id = "episodes";
sidebar.appendChild(episodes);

let moreEpisodes = document.createElement("button");
moreEpisodes.innerText = "Load more";
moreEpisodes.id = "loadMore";
sidebar.appendChild(moreEpisodes);

loadEpisodes();

function loadEpisodes(url) {
  fetch(url || "https://rickandmortyapi.com/api/episode")
    .then((res) => res.json())
    .then(showEpisodes);
}

function showEpisodes(episodes) {
  episodes.results.forEach(addEpisodeToSidebar);
  if (episodes.info.next) {
    moreEpisodes.onclick = () => loadEpisodes(episodes.info.next);
  } else {
    moreEpisodes.classList.add("hidden");
  }
}

function addEpisodeToSidebar(episode) {
  const episodeNode = document.createElement("div");
  episodeNode.innerText = episode.name;
  episodeNode.classList.add("episode");
  episodeNode.addEventListener("click", () => showEpisode(episode));
  episodes.appendChild(episodeNode);
}

function showEpisode(episode) {
  main.innerHTML =
    `<h2 class="episodeTitle">${episode.name}</h2>` +
    `<p class="episodeInfo">${episode.air_date} | ${episode.episode}</p>` +
    `<div id="episodeCharacters"></div>`;
  const episodeCharacters = document.getElementById("episodeCharacters");
  episode.characters.forEach((characterUrl) =>
    episodeCharacters.appendChild(buildCharacter(characterUrl))
  );
}

function buildCharacter(characterUrl) {
  const node = document.createElement("div");
  node.classList.add("character");
  fetch(characterUrl)
    .then((res) => res.json())
    .then((character) => showCharacter(character, node));
  return node;
}

function showCharacter(character, characterNode) {
  const image = document.createElement("img");
  image.src = character.image;
  image.classList.add("characterImage");
  characterNode.appendChild(image);
}
