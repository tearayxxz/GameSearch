const API_KEY = "d0dc6eac4c6c4f5aa79eb4f6f4d79852";
const API_URL = "https://api.rawg.io/api/games";

const platformIds = {
  pc: 4,
  playstation: 18,
  xbox: 1,
  nintendo: 7,
  mobile: 21,
  none: null,
};

async function fetchGames(searchTerm, genre, platform) {
  try {
    const platformId = platform !== "none" ? platformIds[platform] : null;
    const response = await axios.get(API_URL, {
      params: {
        key: API_KEY,
        page_size: 12,
        search: searchTerm,
        genres: genre !== "none" ? genre : undefined,
        platforms: platformId,
      },
    });

    displayResults(response.data.results);
  } catch (error) {
    console.error("Error fetching games:", error);
    alert("Unable to retrieve game data. Please try again.");
  }
}

function displayResults(games) {
  const resultsContainer = document.getElementById("results-container");
  resultsContainer.innerHTML = "";

  if (games.length === 0) {
    resultsContainer.innerHTML = "<p>No results found.</p>";
    return;
  }

  games.forEach((game) => {
    const gameCard = document.createElement("div");
    gameCard.innerHTML = `
        <div class="card bg-base-100 w-full shadow-xl">
            <figure>
                <img
                    src="${
                      game.background_image ||
                      "https://via.placeholder.com/400x300"
                    }"
                    alt="${game.name}"
                    class="h-40 w-full object-cover" />
            </figure>
            <div class="card-body h-56 flex flex-col justify-between">
                <h2 class="card-title text-lg font-semibold line-clamp-2">${
                  game.name
                }</h2>
                <div>
                    <p>Released: ${game.released || "N/A"}</p>
                    <p>Rating: ${game.rating || "N/A"}</p>
                </div>
                <div class="card-actions justify-end">
                    <button class="btn bg-gradient-to-r from-sky-500 to-indigo-500 buy-now text-white" data-game='${encodeURIComponent(
                      JSON.stringify(game)
                    )}'>View more</button>
                </div>
            </div>
        </div>
      `;
    resultsContainer.appendChild(gameCard);
  });

  const buyNowButtons = document.querySelectorAll(".buy-now");
  buyNowButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const gameData = decodeURIComponent(button.getAttribute("data-game"));
      if (!gameData) {
        console.error("Game data is empty or undefined.");
        alert("No game data found. Please try again.");
        return;
      }
      try {
        const trimmedGameData = gameData.trim();
        console.log("Attempting to parse game data:", trimmedGameData);
        const game = JSON.parse(trimmedGameData);
        showModal(game);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        console.error("Game data received:", gameData);
        alert("Unable to retrieve game details. Please try again.");
      }
    });
  });
}

function showModal(game) {
  document.getElementById("modal-title").innerText = game.name;
  document.getElementById("modal-image").src =
    game.background_image || "https://via.placeholder.com/400x300";
  document.getElementById("modal-released").innerText = game.released || "N/A";
  document.getElementById("modal-rating").innerText = game.rating || "N/A";
  document.getElementById("modal-platforms").innerText = game.platforms
    ? game.platforms.map((platform) => platform.platform.name).join(", ")
    : "N/A";
  document.getElementById("modal-genres").innerText = game.genres
    ? game.genres.map((genre) => genre.name).join(", ")
    : "N/A";
  document.getElementById("modal-price").innerText = game.price
    ? `$${game.price}`
    : "Free";
  document.getElementById("modal-store").innerText = game.stores
    ? game.stores.map((store) => store.store.name).join(", ")
    : "N/A";
  document.getElementById("modal-tag").innerText = game.tags
    ? game.tags
        .filter((tag) => tag.language === "eng")
        .map((tag) => tag.name)
        .join(", ")
    : "N/A";

  const modal = document.getElementById("info-modal");
  modal.showModal();
}

document.getElementById("close-modal").addEventListener("click", () => {
  const modal = document.getElementById("info-modal");
  modal.close();
});

document.getElementById("search-button").addEventListener("click", (e) => {
  e.preventDefault();
  const searchTerm = document.getElementById("search-input").value;
  const genre = document.getElementById("genres").value;
  const platform = document.getElementById("platforms").value;

  fetchGames(searchTerm, genre, platform);
});

document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = document.getElementById("search-input").value;
  const genre = document.getElementById("genres").value;
  const platform = document.getElementById("platforms").value;

  fetchGames(searchTerm, genre, platform);
});
