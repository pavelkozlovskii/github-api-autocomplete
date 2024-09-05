const searchInput = document.querySelector(".search__input");
const suggestions = document.querySelector(".search__list");
const reposList = document.querySelector(".search__output-list");

async function getRepos(searchTerm) {
  const response = await fetch(
    `https://api.github.com/search/repositories?q=${searchTerm}`
  );
  const data = await response.json();
  return data.items.slice(0, 5).map((item) => ({
    name: item.name,
    owner: item.owner.login,
    stars: item.stargazers_count,
  }));
}

function displaySuggestions(repos) {
  suggestions.innerHTML = "";
  repos.forEach((repo) => {
    const item = document.createElement("li");
    item.classList.add("search__item");
    item.textContent = repo.name;

    item.addEventListener("click", () => {
      addRepo(repo);
      searchInput.value = "";
    });
    suggestions.appendChild(item);
  });
}
function addRepo(repo) {
  const item = document.createElement("li");
  item.classList.add("search__item-output");

  item.innerHTML = `
    <span>Name: ${repo.name}</span>
    <span>Owner: ${repo.owner}</span>
    <span>Stars: ${repo.stars}</span>
    <button class='search__output-btn'>x</button>
    `;
  item.querySelector(".search__output-btn").addEventListener("click", () => {
    item.remove();
  });
  suggestions.innerHTML = "";
  reposList.appendChild(item);
}

let timeout;
const debounceDelay = 500;

searchInput.addEventListener("input", () => {
  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(async () => {
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
      suggestions.innerHTML = "";
      return;
    }
    const repos = await getRepos(searchTerm);
    displaySuggestions(repos);
  }, debounceDelay);
});
